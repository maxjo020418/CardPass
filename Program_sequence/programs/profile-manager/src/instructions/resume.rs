use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;
use crate::events::*;

pub fn compress_resume(
    ctx: Context<CompressResume>,
    resume_data_hash: [u8; 32], // Hash of the resume link/data
    metadata_uri: String,       // IPFS URI containing encrypted resume metadata
) -> Result<()> {
    let clock = Clock::get()?;

    // Validate inputs
    require!(!metadata_uri.is_empty(), ProfileManagerError::InvalidMetadataUri);
    require!(metadata_uri.len() <= 200, ProfileManagerError::MetadataUriTooLong);

    // Store keys before mutable borrow
    let profile_key = ctx.accounts.profile.key();
    let merkle_tree_key = ctx.accounts.merkle_tree.key();

    let profile = &mut ctx.accounts.profile;

    // TODO: Implement zk-compressed NFT creation using mpl-bubblegum
    // For now, we'll store the metadata references

    // Calculate next leaf index (in real implementation, this would come from the merkle tree)
    let next_leaf_index = 0u32; // Placeholder - should be calculated dynamically

    // Calculate new root hash (in real implementation, this would be computed from merkle tree)
    let mut new_root_hash = [0u8; 32];
    new_root_hash[..32].copy_from_slice(&resume_data_hash[..32]);

    // Update profile with compressed resume information
    profile.resume_merkle_tree = Some(merkle_tree_key);
    profile.resume_leaf_index = Some(next_leaf_index);
    profile.resume_root_hash = Some(new_root_hash);
    profile.updated_at = clock.unix_timestamp;

    // Store values for event emission
    let profile_owner = profile.owner;

    // Emit event for resume compression
    emit!(ResumeCompressed {
        owner: profile_owner,
        profile: profile_key,
        merkle_tree: merkle_tree_key,
        leaf_index: next_leaf_index,
        data_hash: resume_data_hash,
        metadata_uri: metadata_uri,
        compressed_at: clock.unix_timestamp,
    });

    msg!("Resume compressed successfully for profile: {}", profile_key);

    Ok(())
}

pub fn verify_resume_access(
    ctx: Context<VerifyResumeAccess>,
    merkle_proof: Vec<[u8; 32]>, // Merkle proof for verification
) -> Result<String> {
    let profile = &ctx.accounts.profile;

    // Verify that resume exists
    require!(profile.resume_merkle_tree.is_some(), ProfileManagerError::NoResumeData);
    require!(profile.resume_leaf_index.is_some(), ProfileManagerError::NoResumeData);
    require!(profile.resume_root_hash.is_some(), ProfileManagerError::NoResumeData);

    // TODO: Implement merkle proof verification
    // For now, we'll just return a success message

    // Verify merkle proof (placeholder implementation)
    let is_valid = verify_merkle_proof(
        &merkle_proof,
        &profile.resume_root_hash.unwrap(),
        profile.resume_leaf_index.unwrap(),
    );

    require!(is_valid, ProfileManagerError::InvalidResumeProof);

    // Return metadata URI for accessing the resume
    let metadata_uri = format!("ipfs://resume-{}-{}",
        profile.owner.to_string(),
        profile.resume_leaf_index.unwrap()
    );

    emit!(ResumeAccessed {
        requester: ctx.accounts.requester.key(),
        profile_owner: profile.owner,
        profile: ctx.accounts.profile.key(),
        accessed_at: Clock::get()?.unix_timestamp,
    });

    Ok(metadata_uri)
}

// Placeholder function for merkle proof verification
fn verify_merkle_proof(
    proof: &Vec<[u8; 32]>,
    root: &[u8; 32],
    leaf_index: u32,
) -> bool {
    // TODO: Implement actual merkle proof verification
    // This is a placeholder that always returns true for development
    true
}

#[derive(Accounts)]
pub struct CompressResume<'info> {
    #[account(
        mut,
        seeds = [b"profile", owner.key().as_ref()],
        bump = profile.bump,
        has_one = owner
    )]
    pub profile: Account<'info, Profile>,

    #[account(mut)]
    pub owner: Signer<'info>,

    /// CHECK: Merkle tree for compressed resume storage
    /// In real implementation, this would be created via mpl-bubblegum
    #[account(mut)]
    pub merkle_tree: UncheckedAccount<'info>,

    /// CHECK: Tree config account for mpl-bubblegum
    pub tree_config: UncheckedAccount<'info>,

    // TODO: Add compression program and log wrapper when implementing mpl-bubblegum
    // pub compression_program: Program<'info, SplAccountCompression>,
    // pub log_wrapper: Program<'info, Noop>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyResumeAccess<'info> {
    #[account(
        seeds = [b"profile", profile.owner.as_ref()],
        bump = profile.bump
    )]
    pub profile: Account<'info, Profile>,

    pub requester: Signer<'info>,

    /// CHECK: Merkle tree containing the resume data
    pub merkle_tree: UncheckedAccount<'info>,
}