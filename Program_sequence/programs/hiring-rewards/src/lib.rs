use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;

use instructions::*;
use errors::*;
use state::*;

declare_id!("HQAgXyTzVkb7nPcULH8BbigDFR1Wc8mQWrG2Su3UeD9b");

#[program]
pub mod hiring_rewards {
    use super::*;

    pub fn create_reward_pool(ctx: Context<CreateRewardPool>, reward_tiers: Vec<RewardTier>) -> Result<()> {
        instructions::create_pool::create_reward_pool(ctx, reward_tiers)
    }

    pub fn deposit_to_pool(ctx: Context<DepositToPool>, amount: u64) -> Result<()> {
        instructions::deposit::deposit_to_pool(ctx, amount)
    }

    pub fn distribute_reward(ctx: Context<DistributeReward>, tier_index: u8) -> Result<()> {
        instructions::distribute::distribute_reward(ctx, tier_index)
    }

    pub fn create_referral(ctx: Context<CreateReferral>, referee: Pubkey) -> Result<()> {
        instructions::referral::create_referral(ctx, referee)
    }
}
