use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use crate::state::ResumeNft;
use crate::errors::ResumeMarketplaceError;
use crate::events::RoyaltyPaid;

#[derive(Accounts)]
pub struct PurchaseResume<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"resume", mint.key().as_ref()],
        bump = resume_nft.bump,
        has_one = owner,
    )]
    pub resume_nft: Account<'info, ResumeNft>,

    #[account(mut)]
    /// CHECK: This is not dangerous because we are checking this in the instruction
    pub owner: AccountInfo<'info>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = owner,
    )]
    pub owner_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer_usdc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub owner_usdc_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub original_creator_usdc_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, anchor_spl::associated_token::AssociatedToken>,
}

pub fn purchase_resume(ctx: Context<PurchaseResume>) -> Result<()> {
    let resume_nft = &mut ctx.accounts.resume_nft;
    require!(resume_nft.is_for_sale, ResumeMarketplaceError::NotForSale);

    let royalty_amount = resume_nft.price * resume_nft.royalty_percentage as u64 / 100;
    let seller_amount = resume_nft.price - royalty_amount;

    // Transfer USDC from buyer to owner
    let transfer_to_seller_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.buyer_usdc_account.to_account_info(),
            to: ctx.accounts.owner_usdc_account.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        },
    );
    token::transfer(transfer_to_seller_ctx, seller_amount)?;

    // Transfer royalty to original creator
    let transfer_royalty_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.buyer_usdc_account.to_account_info(),
            to: ctx.accounts.original_creator_usdc_account.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        },
    );
    token::transfer(transfer_royalty_ctx, royalty_amount)?;

    emit!(RoyaltyPaid {
        mint: ctx.accounts.mint.key(),
        original_creator: resume_nft.original_creator,
        amount: royalty_amount,
    });

    // Transfer NFT from owner to buyer
    let seeds = &[
        b"resume".as_ref(),
        ctx.accounts.mint.to_account_info().key.as_ref(),
        &[resume_nft.bump],
    ];
    let signer = &[&seeds[..]];
    let transfer_nft_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.owner_token_account.to_account_info(),
            to: ctx.accounts.buyer_token_account.to_account_info(),
            authority: resume_nft.to_account_info(),
        },
        signer,
    );
    token::transfer(transfer_nft_ctx, 1)?;

    resume_nft.owner = ctx.accounts.buyer.key();
    resume_nft.is_for_sale = false;

    Ok(())
}

