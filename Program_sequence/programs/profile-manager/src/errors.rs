use anchor_lang::prelude::*;

#[error_code]
pub enum ProfileManagerError {
    #[msg("Too many skills provided")]
    TooManySkills,
    #[msg("Bio is too long")]
    BioTooLong,
    #[msg("Invalid handle length")]
    InvalidHandle,
    #[msg("Invalid response time")]
    InvalidResponseTime,
    #[msg("Message is too long")]
    MessageTooLong,
    #[msg("Contact not allowed")]
    ContactNotAllowed,
    #[msg("Contact request already processed")]
    ContactAlreadyProcessed,
    #[msg("Contact request expired")]
    ContactExpired,
    #[msg("Invalid USDC mint address")]
    InvalidUSDCMint,
    #[msg("Invalid contact status for payment")]
    InvalidContactStatus,
    #[msg("Contact request has expired")]
    ContactRequestExpired,
    #[msg("Invalid profile owner")]
    InvalidProfileOwner,
    #[msg("Cannot refund payment")]
    CannotRefund,
    #[msg("Insufficient payment amount")]
    InsufficientPayment,
    #[msg("Contact not expired yet")]
    ContactNotExpired,
    #[msg("Invalid tier index")]
    InvalidTierIndex,
    #[msg("Invalid metadata URI")]
    InvalidMetadataUri,
    #[msg("Metadata URI is too long")]
    MetadataUriTooLong,
    #[msg("No resume data available")]
    NoResumeData,
    #[msg("Invalid resume proof")]
    InvalidResumeProof,
}