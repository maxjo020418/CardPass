use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace, Default)]
pub struct Referral {
    pub referrer: Pubkey,
    pub referee: Pubkey,
    pub reward_pool: Pubkey,
    pub created_at: i64,
    pub bump: u8,
}
