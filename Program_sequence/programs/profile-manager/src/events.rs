use anchor_lang::prelude::*;

#[event]
pub struct ProfileCreated {
    pub owner: Pubkey,
    pub handle: String,
    pub skills: Vec<String>,
    pub region: String,
    pub experience_years: u16,
    pub is_public: bool,
    pub created_at: i64,
}

#[event]
pub struct ResumeCompressed {
    pub owner: Pubkey,
    pub profile: Pubkey,
    pub merkle_tree: Pubkey,
    pub leaf_index: u32,
    pub data_hash: [u8; 32],
    pub metadata_uri: String,
    pub compressed_at: i64,
}

#[event]
pub struct ResumeAccessed {
    pub requester: Pubkey,
    pub profile_owner: Pubkey,
    pub profile: Pubkey,
    pub accessed_at: i64,
}

#[event]
pub struct ContactRequestSent {
    pub requester: Pubkey,
    pub target: Pubkey,
    pub amount: u64,
    pub created_at: i64,
}

#[event]
pub struct ContactRequestProcessed {
    pub requester: Pubkey,
    pub target: Pubkey,
    pub accepted: bool,
    pub amount: u64,
}

#[event]
pub struct ContactRequestExpired {
    pub requester: Pubkey,
    pub target: Pubkey,
    pub amount: u64,
}