use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;
pub mod events;

use instructions::*;
use state::*;
use errors::*;
use events::*;

declare_id!("2qABiq2mqKPrp8H2eFqshFZ4EjTYMHPcmepnHD4TuwgN");

#[program]
pub mod job_application {
    use super::*;

    pub fn create_job(
        ctx: Context<CreateJob>,
        title: String,
        description: String,
        required_skills: Vec<String>,
        salary_min: u64,
        salary_max: u64,
        deadline_days: u16,
        job_id: u64,
        hiring_bounty: u64,
    ) -> Result<()> {
        instructions::job::create_job(
            ctx,
            title,
            description,
            required_skills,
            salary_min,
            salary_max,
            deadline_days,
            job_id,
            hiring_bounty,
        )
    }

    pub fn apply_to_job(
        ctx: Context<ApplyToJob>,
        cover_letter: String,
        referral_link_id: Option<u64>,
    ) -> Result<()> {
        instructions::application::apply_to_job(ctx, cover_letter, referral_link_id)
    }

    pub fn create_referral_link(
        ctx: Context<CreateReferralLink>,
        job_key: Pubkey,
        link_id: u64,
    ) -> Result<()> {
        instructions::referral::create_referral_link(ctx, job_key, link_id)
    }

    pub fn update_application_status(
        ctx: Context<UpdateApplicationStatus>,
        new_status: ApplicationStatus,
    ) -> Result<()> {
        instructions::application::update_application_status(ctx, new_status)
    }

    pub fn hire_applicant(ctx: Context<HireApplicant>, tier_index: u8) -> Result<()> {
        instructions::application::hire_applicant(ctx, tier_index)
    }
}