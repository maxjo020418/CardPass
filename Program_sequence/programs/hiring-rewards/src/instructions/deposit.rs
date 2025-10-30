use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};
use crate::state::RewardPool;

#[derive(Accounts)]
pub struct DepositToPool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"reward_pool", usdc_mint.key().as_ref(), authority.key().as_ref()],
        bump = reward_pool.bump,
        has_one = authority,
    )]
    pub reward_pool: Account<'info, RewardPool>,

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = usdc_mint,
        associated_token::authority = reward_pool,
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub source_token_account: Account<'info, TokenAccount>,

    pub usdc_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn deposit_to_pool(ctx: Context<DepositToPool>, amount: u64) -> Result<()> {
    let cpi_accounts = Transfer {
        from: ctx.accounts.source_token_account.to_account_info(),
        to: ctx.accounts.reward_vault.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, amount)?;

    ctx.accounts.reward_pool.total_amount = ctx.accounts.reward_pool.total_amount.checked_add(amount).unwrap();

    Ok(())
}
