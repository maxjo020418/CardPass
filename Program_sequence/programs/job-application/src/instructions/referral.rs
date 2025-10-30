use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;
use crate::events::*;

pub fn create_referral_link(
    ctx: Context<CreateReferralLink>,
    job_key: Pubkey,
    link_id: u64,
) -> Result<()> {
    let referral_link = &mut ctx.accounts.referral_link;
    let clock = Clock::get()?;

    referral_link.job = job_key;
    referral_link.referrer = ctx.accounts.referrer.key();
    referral_link.link_id = link_id;
    referral_link.created_at = clock.unix_timestamp;
    referral_link.applications_count = 0;
    referral_link.successful_hires = 0;
    referral_link.is_active = true;
    referral_link.bump = ctx.bumps.referral_link;

    emit!(ReferralLinkCreated {
        job: job_key,
        referrer: referral_link.referrer,
        link_id,
        created_at: clock.unix_timestamp,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(job_key: Pubkey, link_id: u64)]
pub struct CreateReferralLink<'info> {
    #[account(
        init,
        payer = referrer,
        space = 8 + ReferralLink::INIT_SPACE,
        seeds = [b"referral", referrer.key().as_ref(), job_key.as_ref(), &link_id.to_le_bytes()],
        bump
    )]
    pub referral_link: Account<'info, ReferralLink>,

    #[account(mut)]
    pub referrer: Signer<'info>,

    pub system_program: Program<'info, System>,
}