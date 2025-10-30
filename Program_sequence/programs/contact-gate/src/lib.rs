use anchor_lang::prelude::*;

declare_id!("Dp7V95LBVp5Y6YVzYTfgrD2PKgXCgYXqw69QT4DqZoP6");

#[program]
pub mod contact_gate {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}