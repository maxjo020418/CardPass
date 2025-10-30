use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, Mint, Token, TokenAccount, Transfer},
};
use crate::state::{RewardPool, Referral};
use crate::errors::HiringRewardError;

#[derive(Accounts)]
pub struct DistributeReward<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"reward_pool", usdc_mint.key().as_ref(), authority.key().as_ref()],
        bump = reward_pool.bump,
        has_one = authority,
    )]
    pub reward_pool: Account<'info, RewardPool>,

    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = reward_pool,
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub destination_token_account: Account<'info, TokenAccount>,

    /// CHECK: Optional referrer token account
    #[account(mut)]
    pub referrer_token_account: Option<AccountInfo<'info>>,

    pub usdc_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,

    pub referral: Option<AccountInfo<'info>>,
}

pub fn distribute_reward(ctx: Context<DistributeReward>, tier_index: u8) -> Result<()> {
    let pool = &mut ctx.accounts.reward_pool;
    require!(!pool.reward_tiers.is_empty(), HiringRewardError::NoTiersAvailable);
    require!((tier_index as usize) < pool.reward_tiers.len(), HiringRewardError::InvalidTierIndex);

    let reward_amount = pool.reward_tiers[tier_index as usize].reward_amount;
    require!(pool.total_amount >= reward_amount, HiringRewardError::InsufficientFunds);

    let seeds = &[
        b"reward_pool".as_ref(),
        ctx.accounts.usdc_mint.to_account_info().key.as_ref(),
        ctx.accounts.authority.to_account_info().key.as_ref(),
        &[pool.bump],
    ];
    let signer = &[&seeds[..]];

    if let (Some(referral), Some(referrer_token_account)) = (&ctx.accounts.referral, &ctx.accounts.referrer_token_account) {
        // 50/50 split
        let referee_reward = reward_amount / 2;
        let referrer_reward = reward_amount - referee_reward; // Avoid dust

        // Transfer to referee
        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_vault.to_account_info(),
            to: ctx.accounts.destination_token_account.to_account_info(),
            authority: pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, referee_reward)?;

        // Transfer to referrer
        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_vault.to_account_info(),
            to: referrer_token_account.to_account_info(),
            authority: pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, referrer_reward)?;

    } else {
        // Transfer to referee only
        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_vault.to_account_info(),
            to: ctx.accounts.destination_token_account.to_account_info(),
            authority: pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, reward_amount)?;
    }

    pool.total_amount = pool.total_amount.checked_sub(reward_amount).unwrap();

    Ok(())
}