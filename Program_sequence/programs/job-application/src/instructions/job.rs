use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Mint};
use crate::state::*;
use crate::errors::*;
use crate::events::*;

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
    let job = &mut ctx.accounts.job;
    let job_bounty = &mut ctx.accounts.job_bounty;
    let clock = Clock::get()?;

    require!(title.len() <= 100, JobApplicationError::TitleTooLong);
    require!(description.len() <= 1000, JobApplicationError::DescriptionTooLong);
    require!(required_skills.len() <= 10, JobApplicationError::TooManySkills);
    require!(salary_max >= salary_min, JobApplicationError::InvalidSalaryRange);
    require!(deadline_days > 0 && deadline_days <= 365, JobApplicationError::InvalidDeadline);
    require!(hiring_bounty > 0, JobApplicationError::InvalidBountyAmount);

    // Transfer bounty to escrow
    if hiring_bounty > 0 {
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.recruiter_token_account.to_account_info(),
                to: ctx.accounts.bounty_escrow_account.to_account_info(),
                authority: ctx.accounts.recruiter.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, hiring_bounty)?;
    }

    job.recruiter = ctx.accounts.recruiter.key();
    job.title = title.clone();
    job.description = description;
    job.required_skills = required_skills;
    job.salary_min = salary_min;
    job.salary_max = salary_max;
    job.created_at = clock.unix_timestamp;
    job.deadline = clock.unix_timestamp + (deadline_days as i64 * 24 * 60 * 60);
    job.is_active = true;
    job.application_count = 0;
    job.hiring_bounty = hiring_bounty;
    job.bounty_distributed = false;
    job.job_id = job_id;
    job.bump = ctx.bumps.job;

    job_bounty.job = job.key();
    job_bounty.recruiter = ctx.accounts.recruiter.key();
    job_bounty.amount = hiring_bounty;
    job_bounty.direct_hire_percentage = 70; // 70% for direct hire candidate
    job_bounty.referral_percentage = 20;    // 20% for referrer
    job_bounty.candidate_percentage = 50;   // 50% for referred candidate
    job_bounty.distributed = false;
    job_bounty.bump = ctx.bumps.job_bounty;

    emit!(JobCreated {
        job_id: job.key(),
        recruiter: job.recruiter,
        title,
        hiring_bounty,
        created_at: job.created_at,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(title: String, description: String, required_skills: Vec<String>, salary_min: u64, salary_max: u64, deadline_days: u16, job_id: u64, hiring_bounty: u64)]
pub struct CreateJob<'info> {
    #[account(
        init,
        payer = recruiter,
        space = 8 + Job::INIT_SPACE,
        seeds = [b"job", recruiter.key().as_ref(), &job_id.to_le_bytes()],
        bump
    )]
    pub job: Account<'info, Job>,

    #[account(
        init,
        payer = recruiter,
        space = 8 + JobBounty::INIT_SPACE,
        seeds = [b"job_bounty", job.key().as_ref()],
        bump
    )]
    pub job_bounty: Account<'info, JobBounty>,

    #[account(mut)]
    pub recruiter: Signer<'info>,

    #[account(mut)]
    pub recruiter_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = recruiter,
        token::mint = usdc_mint,
        token::authority = bounty_authority,
        seeds = [b"bounty_escrow", job.key().as_ref()],
        bump
    )]
    pub bounty_escrow_account: Account<'info, TokenAccount>,

    /// CHECK: PDA authority for bounty escrow
    #[account(
        seeds = [b"bounty_authority", job.key().as_ref()],
        bump
    )]
    pub bounty_authority: AccountInfo<'info>,

    pub usdc_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}