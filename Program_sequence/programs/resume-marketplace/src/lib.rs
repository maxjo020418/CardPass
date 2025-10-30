use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;
pub mod events;

use instructions::*;
use state::*;
use errors::*;
use events::*;

declare_id!("9DWZHxCyaPDRj6mWAKP5nMLVBcSL7thyb38RjnEzmnE8");

#[program]
pub mod resume_marketplace {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn list_resume(ctx: Context<ListResume>, price: u64, royalty_percentage: u8) -> Result<()> {
        instructions::list_resume::list_resume(ctx, price, royalty_percentage)
    }

    pub fn purchase_resume(ctx: Context<PurchaseResume>) -> Result<()> {
        instructions::purchase_resume::purchase_resume(ctx)
    }

    pub fn verify_resume(ctx: Context<VerifyResume>) -> Result<()> {
        instructions::verify_resume::verify_resume(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}