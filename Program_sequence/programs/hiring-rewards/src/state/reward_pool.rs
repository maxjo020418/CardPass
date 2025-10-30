use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace, Default)]
pub struct RewardPool {
    pub authority: Pubkey,
    pub total_amount: u64,
    pub usdc_mint: Pubkey,
    #[max_len(5)]
    pub reward_tiers: Vec<RewardTier>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Default)]
pub struct RewardTier {
    pub reward_amount: u64,
    #[max_len(50)]
    pub description: String,
}
