use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Profile {
    pub owner: Pubkey,

    // 🔍 Public indexable data (searchable by Helius)
    #[max_len(10, 50)]
    pub skills: Vec<String>,           // Max 10 skills for search optimization
    pub experience_years: u16,         // Years of experience
    #[max_len(50)]
    pub region: String,                // Location for filtering
    #[max_len(280)]
    pub bio: String,                   // Brief description (Twitter-like limit)
    #[max_len(30)]
    pub handle: String,                // Unique handle for profile URL
    #[max_len(5)]
    pub contact_prices: Vec<ContactPriceTier>, // Contact pricing tiers
    pub response_time_hours: u16,      // Expected response time in hours

    // 🔐 Decentralized private data (zk-compressed)
    pub resume_merkle_tree: Option<Pubkey>, // Merkle tree address for resume
    pub resume_leaf_index: Option<u32>,     // Position in the tree
    pub resume_root_hash: Option<[u8; 32]>, // Root hash for verification

    // NFT metadata
    pub nft_mint: Option<Pubkey>,      // NFT mint address for digital business card

    // Metadata
    pub is_public: bool,               // Whether to show in public talent directory
    pub created_at: i64,
    pub updated_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ContactRequest {
    pub requester: Pubkey,
    pub target_profile: Pubkey,
    #[max_len(1000)]
    pub message: String,
    pub amount: u64,
    pub created_at: i64,
    pub expires_at: i64,
    pub status: ContactStatus,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, InitSpace)]
pub enum ContactStatus {
    Pending,
    Responded,
    Rejected,
    Expired,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct ContactPriceTier {
    pub price: u64,
    #[max_len(50)]
    pub description: String,
}