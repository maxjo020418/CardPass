use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Application {
    pub applicant: Pubkey,
    pub job: Pubkey,
    pub profile: Pubkey,
    #[max_len(1000)]
    pub cover_letter: String,
    pub applied_at: i64,
    pub status: ApplicationStatus,
    pub referrer: Option<Pubkey>, // for referral tracking
    pub referral_link_id: Option<u64>,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ReferralLink {
    pub job: Pubkey,
    pub referrer: Pubkey,
    pub link_id: u64,
    pub created_at: i64,
    pub applications_count: u32,
    pub successful_hires: u32,
    pub is_active: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, InitSpace, Debug)]
pub enum ApplicationStatus {
    Pending,
    Reviewing,
    Interview,
    Accepted,
    Rejected,
    Hired,
}