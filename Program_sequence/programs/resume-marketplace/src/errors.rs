use anchor_lang::prelude::*;

#[error_code]
pub enum ResumeMarketplaceError {
    #[msg("This resume is not for sale.")]
    NotForSale,
}
