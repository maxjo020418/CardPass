use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

use crate::state::{ContactRequest, ContactStatus, Profile};
use crate::errors::ProfileManagerError;

#[derive(Accounts)]
pub struct ProcessPayment<'info> {
    #[account(
        seeds = [b"profile", target_profile_owner.key().as_ref()],
        bump = target_profile.bump,
    )]
    pub target_profile: Account<'info, Profile>,

    #[account(
        mut,
        seeds = [
            b"contact_request",
            requester.key().as_ref(),
            target_profile.key().as_ref()
        ],
        bump = contact_request.bump,
        has_one = requester,
        constraint = contact_request.status == ContactStatus::Pending @ ProfileManagerError::InvalidContactStatus,
        constraint = contact_request.expires_at > Clock::get()?.unix_timestamp @ ProfileManagerError::ContactRequestExpired,
    )]
    pub contact_request: Account<'info, ContactRequest>,

    #[account(mut)]
    pub requester: Signer<'info>,

    /// CHECK: This is the owner of the target profile
    pub target_profile_owner: UncheckedAccount<'info>,

    // USDC Mint - using a well-known USDC mint address
    #[account(
        constraint = usdc_mint.key() == get_usdc_mint_pubkey() @ ProfileManagerError::InvalidUSDCMint
    )]
    pub usdc_mint: Account<'info, Mint>,

    // Requester's USDC token account
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = requester,
    )]
    pub requester_usdc_account: Account<'info, TokenAccount>,

    // Target profile owner's USDC token account
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = target_profile_owner,
    )]
    pub target_usdc_account: Account<'info, TokenAccount>,

    // Escrow account for holding payments during processing
    #[account(
        init,
        payer = requester,
        seeds = [
            b"escrow",
            contact_request.key().as_ref(),
        ],
        bump,
        token::mint = usdc_mint,
        token::authority = escrow_authority,
    )]
    pub escrow_account: Account<'info, TokenAccount>,

    /// CHECK: PDA authority for the escrow account
    #[account(
        seeds = [b"escrow_authority"],
        bump
    )]
    pub escrow_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompletePayment<'info> {
    #[account(
        mut,
        seeds = [b"profile", target_profile_owner.key().as_ref()],
        bump = target_profile.bump,
        constraint = target_profile.owner == target_profile_owner.key() @ ProfileManagerError::InvalidProfileOwner
    )]
    pub target_profile: Account<'info, Profile>,

    #[account(
        mut,
        seeds = [
            b"contact_request",
            contact_request.requester.key().as_ref(),
            target_profile.key().as_ref()
        ],
        bump = contact_request.bump,
        constraint = contact_request.status == ContactStatus::Pending @ ProfileManagerError::InvalidContactStatus,
    )]
    pub contact_request: Account<'info, ContactRequest>,

    #[account(mut)]
    pub target_profile_owner: Signer<'info>,

    /// CHECK: This is validated through the contact_request
    pub requester: UncheckedAccount<'info>,

    // USDC Mint
    #[account(
        constraint = usdc_mint.key() == get_usdc_mint_pubkey() @ ProfileManagerError::InvalidUSDCMint
    )]
    pub usdc_mint: Account<'info, Mint>,

    // Target profile owner's USDC token account
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = target_profile_owner,
    )]
    pub target_usdc_account: Account<'info, TokenAccount>,

    // Escrow account
    #[account(
        mut,
        seeds = [
            b"escrow",
            contact_request.key().as_ref(),
        ],
        bump,
        token::mint = usdc_mint,
        token::authority = escrow_authority,
    )]
    pub escrow_account: Account<'info, TokenAccount>,

    /// CHECK: PDA authority for the escrow account
    #[account(
        seeds = [b"escrow_authority"],
        bump
    )]
    pub escrow_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn process_payment(ctx: Context<ProcessPayment>) -> Result<()> {
    let contact_request = &mut ctx.accounts.contact_request;
    let amount = contact_request.amount;

    // Transfer USDC from requester to escrow
    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.requester_usdc_account.to_account_info(),
                to: ctx.accounts.escrow_account.to_account_info(),
                authority: ctx.accounts.requester.to_account_info(),
            },
        ),
        amount,
    )?;

    msg!("Payment of {} USDC escrowed for contact request", amount);
    Ok(())
}

pub fn complete_payment(ctx: Context<CompletePayment>, accept: bool) -> Result<()> {
    let contact_request = &mut ctx.accounts.contact_request;
    let amount = contact_request.amount;

    if accept {
        // Transfer from escrow to target profile owner
        let escrow_authority_bump = ctx.bumps.escrow_authority;
        let escrow_seeds = &[b"escrow_authority".as_ref(), &[escrow_authority_bump]];
        let signer_seeds = &[&escrow_seeds[..]];

        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.escrow_account.to_account_info(),
                    to: ctx.accounts.target_usdc_account.to_account_info(),
                    authority: ctx.accounts.escrow_authority.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
        )?;

        contact_request.status = ContactStatus::Responded;
        msg!("Contact request accepted - payment of {} USDC transferred", amount);
    } else {
        // Return payment to requester (refund)
        // Note: This would require the requester's token account
        // For now, we'll mark as rejected and handle refund separately
        contact_request.status = ContactStatus::Rejected;
        msg!("Contact request rejected - payment held in escrow for refund");
    }

    Ok(())
}

pub fn refund_payment(ctx: Context<RefundPayment>) -> Result<()> {
    let contact_request = &ctx.accounts.contact_request;
    let amount = contact_request.amount;

    require!(
        contact_request.status == ContactStatus::Rejected ||
        contact_request.expires_at < Clock::get()?.unix_timestamp,
        ProfileManagerError::CannotRefund
    );

    // Transfer from escrow back to requester
    let escrow_authority_bump = ctx.bumps.escrow_authority;
    let escrow_seeds = &[b"escrow_authority".as_ref(), &[escrow_authority_bump]];
    let signer_seeds = &[&escrow_seeds[..]];

    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.escrow_account.to_account_info(),
                to: ctx.accounts.requester_usdc_account.to_account_info(),
                authority: ctx.accounts.escrow_authority.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;

    msg!("Payment of {} USDC refunded to requester", amount);
    Ok(())
}

#[derive(Accounts)]
pub struct RefundPayment<'info> {
    #[account(
        seeds = [
            b"contact_request",
            requester.key().as_ref(),
            target_profile.key().as_ref()
        ],
        bump = contact_request.bump,
        has_one = requester,
    )]
    pub contact_request: Account<'info, ContactRequest>,

    pub target_profile: Account<'info, Profile>,

    #[account(mut)]
    pub requester: Signer<'info>,

    // USDC Mint
    #[account(
        constraint = usdc_mint.key() == get_usdc_mint_pubkey() @ ProfileManagerError::InvalidUSDCMint
    )]
    pub usdc_mint: Account<'info, Mint>,

    // Requester's USDC token account
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = requester,
    )]
    pub requester_usdc_account: Account<'info, TokenAccount>,

    // Escrow account
    #[account(
        mut,
        seeds = [
            b"escrow",
            contact_request.key().as_ref(),
        ],
        bump,
        token::mint = usdc_mint,
        token::authority = escrow_authority,
    )]
    pub escrow_account: Account<'info, TokenAccount>,

    /// CHECK: PDA authority for the escrow account
    #[account(
        seeds = [b"escrow_authority"],
        bump
    )]
    pub escrow_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

// Helper function to get USDC mint pubkey
// In localnet, we'll use a mock USDC mint
pub fn get_usdc_mint_pubkey() -> Pubkey {
    // For localnet testing, we can use a mock USDC mint
    // In production, this would be the actual USDC mint address
    // Devnet USDC: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
    // Mainnet USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

    // For now, using a placeholder - should be set to actual USDC mint
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU".parse().unwrap()
}