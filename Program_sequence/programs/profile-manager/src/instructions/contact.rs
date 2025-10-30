use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;
use crate::events::*;

pub fn send_contact_request(
    ctx: Context<SendContactRequest>,
    message: String,
    tier_index: u8,
) -> Result<()> {
    let contact_request = &mut ctx.accounts.contact_request;
    let target_profile = &ctx.accounts.target_profile;
    let clock = Clock::get()?;

    require!(message.len() <= 1000, ProfileManagerError::MessageTooLong);
    require!(!target_profile.contact_prices.is_empty(), ProfileManagerError::ContactNotAllowed);
    require!((tier_index as usize) < target_profile.contact_prices.len(), ProfileManagerError::InvalidTierIndex);

    let price = target_profile.contact_prices[tier_index as usize].price;
    require!(price > 0, ProfileManagerError::ContactNotAllowed);

    // Transfer USDC to escrow
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.requester_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.requester.to_account_info(),
        },
    );
    token::transfer(transfer_ctx, price)?;

    contact_request.requester = ctx.accounts.requester.key();
    contact_request.target_profile = ctx.accounts.target_profile.key();
    contact_request.message = message;
    contact_request.amount = price;
    contact_request.created_at = clock.unix_timestamp;
    contact_request.expires_at = clock.unix_timestamp + (target_profile.response_time_hours as i64 * 3600);
    contact_request.status = ContactStatus::Pending;
    contact_request.bump = ctx.bumps.contact_request;

    emit!(ContactRequestSent {
        requester: contact_request.requester,
        target: contact_request.target_profile,
        amount: contact_request.amount,
        created_at: contact_request.created_at,
    });

    Ok(())
}

pub fn respond_to_contact(
    ctx: Context<RespondToContact>,
    accept: bool,
) -> Result<()> {
    let contact_request = &mut ctx.accounts.contact_request;
    let clock = Clock::get()?;

    require!(
        contact_request.status == ContactStatus::Pending,
        ProfileManagerError::ContactAlreadyProcessed
    );
    require!(
        clock.unix_timestamp <= contact_request.expires_at,
        ProfileManagerError::ContactExpired
    );

    let contact_key = contact_request.key();
    let escrow_authority_bump = ctx.bumps.escrow_authority;
    let seeds = &[
        b"escrow",
        contact_key.as_ref(),
        &[escrow_authority_bump]
    ];
    let signer_seeds = &[&seeds[..]];

    if accept {
        contact_request.status = ContactStatus::Responded;

        // Transfer payment to target
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.escrow_token_account.to_account_info(),
                to: ctx.accounts.target_token_account.to_account_info(),
                authority: ctx.accounts.escrow_authority.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_ctx, contact_request.amount)?;
    } else {
        contact_request.status = ContactStatus::Rejected;

        // Refund to requester
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.escrow_token_account.to_account_info(),
                to: ctx.accounts.requester_token_account.to_account_info(),
                authority: ctx.accounts.escrow_authority.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_ctx, contact_request.amount)?;
    }

    emit!(ContactRequestProcessed {
        requester: contact_request.requester,
        target: contact_request.target_profile,
        accepted: accept,
        amount: contact_request.amount,
    });

    Ok(())
}

pub fn handle_expired_contact(ctx: Context<HandleExpiredContact>) -> Result<()> {
    let contact_request = &mut ctx.accounts.contact_request;
    let clock = Clock::get()?;

    require!(
        contact_request.status == ContactStatus::Pending,
        ProfileManagerError::ContactNotExpired
    );
    require!(
        clock.unix_timestamp > contact_request.expires_at,
        ProfileManagerError::ContactNotExpired
    );

    contact_request.status = ContactStatus::Expired;

    // Refund to requester
    let contact_key = contact_request.key();
    let escrow_authority_bump = ctx.bumps.escrow_authority;
    let seeds = &[
        b"escrow",
        contact_key.as_ref(),
        &[escrow_authority_bump]
    ];
    let signer_seeds = &[&seeds[..]];

    let transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.requester_token_account.to_account_info(),
            authority: ctx.accounts.escrow_authority.to_account_info(),
        },
        signer_seeds,
    );
    token::transfer(transfer_ctx, contact_request.amount)?;

    emit!(ContactRequestExpired {
        requester: contact_request.requester,
        target: contact_request.target_profile,
        amount: contact_request.amount,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct SendContactRequest<'info> {
    #[account(
        init,
        payer = requester,
        space = 8 + ContactRequest::INIT_SPACE,
        seeds = [b"contact", requester.key().as_ref(), target_profile.key().as_ref()],
        bump
    )]
    pub contact_request: Account<'info, ContactRequest>,

    pub target_profile: Account<'info, Profile>,

    #[account(mut)]
    pub requester: Signer<'info>,

    #[account(mut)]
    pub requester_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = requester,
        token::mint = usdc_mint,
        token::authority = escrow_authority,
        seeds = [b"escrow", contact_request.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    /// CHECK: PDA authority for escrow
    #[account(
        seeds = [b"escrow", contact_request.key().as_ref()],
        bump
    )]
    pub escrow_authority: AccountInfo<'info>,

    /// CHECK: USDC mint
    pub usdc_mint: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct RespondToContact<'info> {
    #[account(
        mut,
        seeds = [b"contact", contact_request.requester.as_ref(), target_profile.key().as_ref()],
        bump = contact_request.bump,
        has_one = target_profile
    )]
    pub contact_request: Account<'info, ContactRequest>,

    #[account(
        seeds = [b"profile", target.key().as_ref()],
        bump = target_profile.bump,
        constraint = target_profile.owner == target.key()
    )]
    pub target_profile: Account<'info, Profile>,

    pub target: Signer<'info>,

    #[account(mut)]
    pub requester_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub target_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,

    /// CHECK: PDA authority for escrow
    #[account(
        seeds = [b"escrow", contact_request.key().as_ref()],
        bump
    )]
    pub escrow_authority: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct HandleExpiredContact<'info> {
    #[account(
        mut,
        seeds = [b"contact", contact_request.requester.as_ref(), contact_request.target_profile.as_ref()],
        bump = contact_request.bump
    )]
    pub contact_request: Account<'info, ContactRequest>,

    #[account(mut)]
    pub requester_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,

    /// CHECK: PDA authority for escrow
    #[account(
        seeds = [b"escrow", contact_request.key().as_ref()],
        bump
    )]
    pub escrow_authority: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
}
