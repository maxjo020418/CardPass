use anchor_lang::prelude::*;
use crate::state::{Referral, RewardPool};

#[derive(Accounts)]
#[instruction(referee: Pubkey)]
pub struct CreateReferral<'info> {
    #[account(mut)]
    pub referrer: Signer<'info>,

    #[account(
        init,
        payer = referrer,
        space = 8 + Referral::INIT_SPACE,
        seeds = [b"referral", reward_pool.key().as_ref(), referrer.key().as_ref(), referee.as_ref()],
        bump
    )]
    pub referral: Account<'info, Referral>,

    pub reward_pool: Account<'info, RewardPool>,

    pub system_program: Program<'info, System>,
}

pub fn create_referral(ctx: Context<CreateReferral>, referee: Pubkey) -> Result<()> {
    let referral = &mut ctx.accounts.referral;
    let clock = Clock::get()?;

    referral.referrer = ctx.accounts.referrer.key();
    referral.referee = referee;
    referral.reward_pool = ctx.accounts.reward_pool.key();
    referral.created_at = clock.unix_timestamp;
    referral.bump = ctx.bumps.referral;

    Ok(())
}
