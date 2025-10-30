use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};
use crate::state::ResumeNft;

#[derive(Accounts)]
pub struct ListResume<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        init,
        payer = owner,
        space = 8 + ResumeNft::INIT_SPACE,
        seeds = [b"resume", mint.key().as_ref()],
        bump
    )]
    pub resume_nft: Account<'info, ResumeNft>,

    pub mint: Account<'info, Mint>,

    #[account(
        associated_token::mint = mint,
        associated_token::authority = owner,
    )]
    pub owner_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
}

pub fn list_resume(ctx: Context<ListResume>, price: u64, royalty_percentage: u8) -> Result<()> {
    let resume_nft = &mut ctx.accounts.resume_nft;
    resume_nft.original_creator = ctx.accounts.owner.key();
    resume_nft.owner = ctx.accounts.owner.key();
    resume_nft.mint = ctx.accounts.mint.key();
    resume_nft.price = price;
    resume_nft.is_for_sale = true;
    resume_nft.royalty_percentage = royalty_percentage;
    resume_nft.bump = ctx.bumps.resume_nft;
    Ok(())
}

