use anchor_lang::prelude::*;

#[event]
pub struct JobCreated {
    pub job_id: Pubkey,
    pub recruiter: Pubkey,
    pub title: String,
    pub hiring_bounty: u64,
    pub created_at: i64,
}

#[event]
pub struct ApplicationSubmitted {
    pub applicant: Pubkey,
    pub job: Pubkey,
    pub referrer: Option<Pubkey>,
    pub applied_at: i64,
}

#[event]
pub struct ApplicationStatusUpdated {
    pub application: Pubkey,
    pub new_status: String,
    pub updated_at: i64,
}

#[event]
pub struct ReferralLinkCreated {
    pub job: Pubkey,
    pub referrer: Pubkey,
    pub link_id: u64,
    pub created_at: i64,
}