use anchor_lang::prelude::*;
use crate::state::ResumeNft;

#[derive(Accounts)]
pub struct VerifyResume<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"resume", resume_nft.mint.as_ref()],
        bump = resume_nft.bump,
        constraint = authority.key().to_string() == "EyRWh1DRQ7c1Fku4RfwEmemHPUKxPRhexXaFgnrDmn8p",
    )]
    pub resume_nft: Account<'info, ResumeNft>,
}

pub fn verify_resume(ctx: Context<VerifyResume>) -> Result<()> {
    ctx.accounts.resume_nft.verified = true;
    Ok(())
}
