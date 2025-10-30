use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;
pub mod events;

use instructions::*;
use state::*;
use errors::*;
use events::*;

declare_id!("9KWbRGWmoX7JVKkeR5XGQhJDGxki15NeFZdkqb5U1MFu");

#[program]
pub mod profile_manager {
    use super::*;

    pub fn create_profile(
        ctx: Context<CreateProfile>,
        skills: Vec<String>,
        experience_years: u16,
        region: String,
        bio: String,
        handle: String,
        contact_prices: Vec<ContactPriceTier>,
        response_time_hours: u16,
        resume_link: Option<String>,
    ) -> Result<()> {
        instructions::profile::create_profile(
            ctx,
            skills,
            experience_years,
            region,
            bio,
            handle,
            contact_prices,
            response_time_hours,
            resume_link,
        )
    }

    pub fn update_profile(
        ctx: Context<UpdateProfile>,
        skills: Option<Vec<String>>,
        bio: Option<String>,
        is_public: Option<bool>,
        contact_prices: Option<Vec<ContactPriceTier>>,
        response_time_hours: Option<u16>,
    ) -> Result<()> {
        instructions::profile::update_profile(
            ctx,
            skills,
            bio,
            is_public,
            contact_prices,
            response_time_hours,
        )
    }

    pub fn send_contact_request(
        ctx: Context<SendContactRequest>,
        message: String,
        tier_index: u8,
    ) -> Result<()> {
        instructions::contact::send_contact_request(ctx, message, tier_index)
    }

    pub fn respond_to_contact(
        ctx: Context<RespondToContact>,
        accept: bool,
    ) -> Result<()> {
        instructions::contact::respond_to_contact(ctx, accept)
    }

    pub fn handle_expired_contact(ctx: Context<HandleExpiredContact>) -> Result<()> {
        instructions::contact::handle_expired_contact(ctx)
    }

    pub fn create_profile_nft(
        ctx: Context<CreateProfileNFT>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        instructions::nft::create_profile_nft(ctx, name, symbol, uri)
    }

    pub fn process_payment(ctx: Context<ProcessPayment>) -> Result<()> {
        instructions::payment::process_payment(ctx)
    }

    pub fn complete_payment(ctx: Context<CompletePayment>, accept: bool) -> Result<()> {
        instructions::payment::complete_payment(ctx, accept)
    }

    pub fn refund_payment(ctx: Context<RefundPayment>) -> Result<()> {
        instructions::payment::refund_payment(ctx)
    }

    pub fn compress_resume(
        ctx: Context<CompressResume>,
        resume_data_hash: [u8; 32],
        metadata_uri: String,
    ) -> Result<()> {
        instructions::resume::compress_resume(ctx, resume_data_hash, metadata_uri)
    }

    pub fn verify_resume_access(
        ctx: Context<VerifyResumeAccess>,
        merkle_proof: Vec<[u8; 32]>,
    ) -> Result<String> {
        instructions::resume::verify_resume_access(ctx, merkle_proof)
    }
}