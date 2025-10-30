use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Job {
    pub recruiter: Pubkey,
    #[max_len(100)]
    pub title: String,
    #[max_len(1000)]
    pub description: String,
    #[max_len(10, 50)]
    pub required_skills: Vec<String>,
    pub salary_min: u64,
    pub salary_max: u64,
    pub created_at: i64,
    pub deadline: i64,
    pub is_active: bool,
    pub application_count: u32,
    pub hiring_bounty: u64,
    pub bounty_distributed: bool,
    pub job_id: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct JobBounty {
    pub job: Pubkey,
    pub recruiter: Pubkey,
    pub amount: u64,
    pub direct_hire_percentage: u8, // percentage for direct hire
    pub referral_percentage: u8,    // percentage for referrer
    pub candidate_percentage: u8,   // percentage for candidate
    pub distributed: bool,
    pub bump: u8,
}