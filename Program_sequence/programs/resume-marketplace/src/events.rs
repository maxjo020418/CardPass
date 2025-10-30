use anchor_lang::prelude::*;

#[event]
pub struct RoyaltyPaid {
    pub mint: Pubkey,
    pub original_creator: Pubkey,
    pub amount: u64,
}
