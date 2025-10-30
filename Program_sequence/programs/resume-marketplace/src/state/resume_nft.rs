use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace, Default)]
pub struct ResumeNft {
    pub original_creator: Pubkey,
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub price: u64,
    pub is_for_sale: bool,
    pub verified: bool,
    pub royalty_percentage: u8,
    pub bump: u8,
}
