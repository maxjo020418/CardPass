use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;
use crate::events::*;
use hiring_rewards::cpi::accounts::DistributeReward;
use hiring_rewards::program::HiringRewards;
use anchor_spl::token::{Token, Mint, TokenAccount};

pub fn apply_to_job(
    ctx: Context<ApplyToJob>,
    cover_letter: String,
    referral_link_id: Option<u64>,
) -> Result<()> {
    let application = &mut ctx.accounts.application;
    let job = &mut ctx.accounts.job;
    let clock = Clock::get()?;

    require!(job.is_active, JobApplicationError::JobNotActive);
    require!(clock.unix_timestamp <= job.deadline, JobApplicationError::InvalidDeadline);

    let referrer = if let Some(link_id) = referral_link_id {
        let referral_link = &ctx.accounts.referral_link.as_ref()
            .ok_or(JobApplicationError::Unauthorized)?;
        require!(referral_link.link_id == link_id, JobApplicationError::Unauthorized);
        require!(referral_link.is_active, JobApplicationError::Unauthorized);
        Some(referral_link.referrer)
    } else {
        None
    };

    application.applicant = ctx.accounts.applicant.key();
    application.job = job.key();
    application.profile = ctx.accounts.profile.key();
    application.cover_letter = cover_letter;
    application.applied_at = clock.unix_timestamp;
    application.status = ApplicationStatus::Pending;
    application.referrer = referrer;
    application.referral_link_id = referral_link_id;
    application.bump = ctx.bumps.application;

    job.application_count = job.application_count.checked_add(1).unwrap();

    if let Some(referral_link) = ctx.accounts.referral_link.as_mut() {
        referral_link.applications_count = referral_link.applications_count.checked_add(1).unwrap();
    }

    emit!(ApplicationSubmitted {
        applicant: application.applicant,
        job: application.job,
        referrer,
        applied_at: application.applied_at,
    });

    Ok(())
}

pub fn update_application_status(
    ctx: Context<UpdateApplicationStatus>,
    new_status: ApplicationStatus,
) -> Result<()> {
    let application = &mut ctx.accounts.application;
    let clock = Clock::get()?;

    application.status = new_status.clone();

    emit!(ApplicationStatusUpdated {
        application: application.key(),
        new_status: format!("{:?}", new_status),
        updated_at: clock.unix_timestamp,
    });

    Ok(())
}

pub fn hire_applicant(ctx: Context<HireApplicant>, tier_index: u8) -> Result<()> {
    let application = &mut ctx.accounts.application;
    let clock = Clock::get()?;

    application.status = ApplicationStatus::Hired;

    emit!(ApplicationStatusUpdated {
        application: application.key(),
        new_status: "Hired".to_string(),
        updated_at: clock.unix_timestamp,
    });

    // Only call reward distribution if there's a reward pool and referral
    if let (Some(reward_pool), Some(reward_vault)) = (&ctx.accounts.reward_pool, &ctx.accounts.reward_vault) {
        let cpi_accounts = DistributeReward {
            authority: ctx.accounts.recruiter.to_account_info(),
            reward_pool: reward_pool.to_account_info(),
            reward_vault: reward_vault.to_account_info(),
            destination_token_account: ctx.accounts.destination_token_account.to_account_info(),
            referrer_token_account: ctx.accounts.referrer_token_account.as_ref().map(|acc| acc.to_account_info()),
            usdc_mint: ctx.accounts.usdc_mint.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
            referral: ctx.accounts.referral.as_ref().map(|acc| acc.to_account_info()),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.hiring_rewards_program.to_account_info(), cpi_accounts);
        hiring_rewards::cpi::distribute_reward(cpi_ctx, tier_index)?;
    }

    Ok(())
}

#[derive(Accounts)]
pub struct ApplyToJob<'info> {
    #[account(
        init,
        payer = applicant,
        space = 8 + Application::INIT_SPACE,
        seeds = [b"application", job.key().as_ref(), applicant.key().as_ref()],
        bump
    )]
    pub application: Account<'info, Application>,

    #[account(mut)]
    pub job: Account<'info, Job>,

    /// CHECK: Profile from profile-manager program
    pub profile: AccountInfo<'info>,

    #[account(mut)]
    pub applicant: Signer<'info>,

    #[account(mut)]
    pub referral_link: Option<Account<'info, ReferralLink>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateApplicationStatus<'info> {
    #[account(
        mut,
        seeds = [b"application", application.job.as_ref(), application.applicant.as_ref()],
        bump = application.bump
    )]
    pub application: Account<'info, Application>,

    #[account(
        has_one = recruiter
    )]
    pub job: Account<'info, Job>,

    pub recruiter: Signer<'info>,
}

#[derive(Accounts)]
pub struct HireApplicant<'info> {
    #[account(
        mut,
        seeds = [b"application", application.job.as_ref(), application.applicant.as_ref()],
        bump = application.bump
    )]
    pub application: Account<'info, Application>,

    #[account(
        has_one = recruiter
    )]
    pub job: Account<'info, Job>,

    pub recruiter: Signer<'info>,

    pub hiring_rewards_program: Program<'info, HiringRewards>,

    /// CHECK: This is not dangerous because we are not writing to this account
    #[account(mut)]
    pub reward_pool: Option<AccountInfo<'info>>,

    /// CHECK: This is not dangerous because we are not writing to this account
    #[account(mut)]
    pub reward_vault: Option<AccountInfo<'info>>,

    #[account(mut)]
    pub destination_token_account: Account<'info, TokenAccount>,

    /// CHECK: This is not dangerous because we are not writing to this account
    #[account(mut)]
    pub referrer_token_account: Option<AccountInfo<'info>>,

    /// CHECK: This is not dangerous because we are not writing to this account
    pub usdc_mint: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,

    /// CHECK: This is not dangerous because we are not writing to this account
    pub referral: Option<AccountInfo<'info>>,
}