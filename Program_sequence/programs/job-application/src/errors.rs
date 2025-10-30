use anchor_lang::prelude::*;

#[error_code]
pub enum JobApplicationError {
    #[msg("Title too long")]
    TitleTooLong,
    #[msg("Description too long")]
    DescriptionTooLong,
    #[msg("Too many skills")]
    TooManySkills,
    #[msg("Invalid salary range")]
    InvalidSalaryRange,
    #[msg("Invalid deadline")]
    InvalidDeadline,
    #[msg("Job is not active")]
    JobNotActive,
    #[msg("Application already exists")]
    ApplicationExists,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid bounty amount")]
    InvalidBountyAmount,
}