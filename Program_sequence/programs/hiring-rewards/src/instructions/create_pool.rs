use anchor_lang::prelude::*;
use anchor_spl::token::{Mint};
use crate::state::{RewardPool, RewardTier};

#[derive(Accounts)]
#[instruction(reward_tiers: Vec<RewardTier>)]
pub struct CreateRewardPool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + RewardPool::INIT_SPACE,
        seeds = [b"reward_pool", usdc_mint.key().as_ref(), authority.key().as_ref()],
        bump
    )]
    pub reward_pool: Account<'info, RewardPool>,

    pub usdc_mint: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
}

pub fn create_reward_pool(ctx: Context<CreateRewardPool>, reward_tiers: Vec<RewardTier>) -> Result<()> {
    let pool = &mut ctx.accounts.reward_pool;
    pool.authority = ctx.accounts.authority.key();
    pool.usdc_mint = ctx.accounts.usdc_mint.key();
    pool.total_amount = 0;
    pool.reward_tiers = reward_tiers;
    pool.bump = ctx.bumps.reward_pool;
    Ok(())
}
