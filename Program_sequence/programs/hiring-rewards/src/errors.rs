use anchor_lang::prelude::*;

#[error_code]
pub enum HiringRewardError {
    #[msg("Insufficient funds in the reward pool.")]
    InsufficientFunds,
    #[msg("No reward tiers available.")]
    NoTiersAvailable,
    #[msg("Invalid tier index.")]
    InvalidTierIndex,
}
