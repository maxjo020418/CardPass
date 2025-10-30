# Program Sequence - Decentralized Professional Network

A Solana-based professional networking platform utilizing **zk-compressed NFTs** for privacy-preserving resume storage while maintaining searchable public profiles.

## 🏗️ Architecture Overview

This project implements a **hybrid architecture** that balances transparency with privacy:

- **Public Indexable Data**: Skills, experience, region, and basic profile info stored on-chain for search optimization via Helius RPC
- **Private Data**: Resume links and sensitive information stored as **zk-compressed NFTs** for true decentralization (~100x cheaper than regular NFTs)

## 📁 Project Structure

```
Program_sequence/
├── programs/                    # Solana programs (smart contracts)
│   ├── profile-manager/        # Main profile management
│   ├── job-platform/          # Job posting and applications
│   ├── referral-system/       # Referral tracking and rewards
│   ├── payment-processor/     # USDC payment handling
│   └── reputation-system/     # User reputation management
├── tests/                     # Integration tests
│   ├── phase2-test.ts        # Basic functionality tests
│   ├── phase3-test.ts        # Advanced feature tests
│   └── scenarios-a-and-b-test.ts  # End-to-end user scenarios
├── docs/                     # Documentation
└── config/                   # Anchor configuration
```

## 🔑 Core Features

### 1. Hybrid Profile System
- **Public Profile Data**: Searchable skills, experience, region, bio, contact prices
- **Private Resume Data**: zk-compressed NFT storage for sensitive information
- **Contact Gate**: Value-based contact system to prevent spam

### 2. Decentralized Job Platform
- **Bounty-Based Hiring**: Smart contract escrow for hiring rewards
- **Referral System**: Automatic reward distribution for successful introductions
- **Direct Applications**: Streamlined application process with signing bonuses

### 3. Resume Privacy Protection
- **zk-Compression**: Sensitive resume data stored as compressed NFTs
- **Merkle Proof Verification**: Secure access control for resume viewing
- **Metadata Encryption**: IPFS/Arweave integration for encrypted storage

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Rust & Cargo
- Solana CLI
- Anchor Framework

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Program_sequence
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start local validator**
   ```bash
   solana-test-validator --reset
   ```

4. **Build and deploy programs**
   ```bash
   anchor build
   anchor deploy
   ```

5. **Run tests**
   ```bash
   # Test scenarios A & B
   ANCHOR_PROVIDER_URL=http://localhost:8899 ANCHOR_WALLET=~/.config/solana/id.json npx ts-mocha -p ./tsconfig.json tests/scenarios-a-and-b-test.ts --timeout 60000

   # Test all functionality
   ANCHOR_PROVIDER_URL=http://localhost:8899 ANCHOR_WALLET=~/.config/solana/id.json npx ts-mocha -p ./tsconfig.json tests/phase2-test.ts --timeout 60000
   ```

## 📋 Program Details

### Profile Manager
**Program ID**: `9KWbRGWmoX7JVKkeR5XGQhJDGxki15NeFZdkqb5U1MFu`

**Key Instructions**:
- `create_profile`: Create profile with public indexable data
- `compress_resume`: Store resume as zk-compressed NFT
- `verify_resume_access`: Verify and access compressed resume data
- `send_contact_request`: Initiate value-based contact

**Hybrid Data Structure**:
```rust
pub struct Profile {
    // 🔍 Public indexable data (searchable by Helius)
    pub skills: Vec<String>,           // Max 10 skills
    pub experience_years: u16,         // Years of experience
    pub region: String,                // Location
    pub bio: String,                   // Brief description (280 chars)
    pub handle: String,                // Unique profile handle
    pub contact_prices: Vec<ContactPriceTier>,
    pub response_time_hours: u16,

    // 🔐 Private zk-compressed data
    pub resume_merkle_tree: Option<Pubkey>,
    pub resume_leaf_index: Option<u32>,
    pub resume_root_hash: Option<[u8; 32]>,
}
```

### Job Platform
**Program ID**: `H8qJmKEaXYMRLJm3oJpYsXYdtF9LQS9f6U67Cp4eE6Wb`

**Key Features**:
- Bounty-based job postings with escrow
- Application tracking and management
- Automatic reward distribution upon hiring

### Payment Processor
**Program ID**: `8VjqWLfH9JYq2P6N5KLfH8Vm7QsXxE4G2Rf3K5Nm8DpZ`

**Key Features**:
- USDC-based payments
- Escrow management for contact requests
- Automatic fee distribution

## 🧪 Testing Scenarios

### Scenario A: Outbound Sourcing
1. Recruiter searches public talent directory
2. Reviews candidate's public profile
3. Sends paid contact request
4. Candidate responds, recruiter gets refund
5. Communication established

### Scenario B: Inbound Application
1. Candidate/Referrer finds job posting
2. Application submitted (direct or via referral link)
3. Hiring process conducted
4. Upon success, bounty automatically distributed

## 🔧 Development

### Building
```bash
anchor build
```

### Testing
```bash
# Run specific test suite
npm run test:scenarios

# Run all tests
npm run test:all
```

### Deployment
```bash
# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet
```

## 📚 Documentation

- [Complete Feature Scenarios](./idea_scenarios.md) - Detailed user scenarios and business logic
- [Deployment Guide](./deploy-devnet.md) - Step-by-step deployment instructions
- [Program Status](./program-deployment-status.md) - Current deployment status

## 🏛️ Technical Architecture

### zk-Compressed NFT Integration
- **Merkle Tree Storage**: Resume data stored in compressed merkle trees
- **Proof Verification**: Zero-knowledge proofs for secure data access
- **Cost Efficiency**: ~100x cheaper than regular NFT storage
- **True Decentralization**: No central authority can access private data

### Helius Integration
- **Profile Indexing**: Public profile data indexed for search
- **Event Monitoring**: Real-time tracking of platform activities
- **RPC Optimization**: Efficient data queries and filtering

### Cross-Program Communication
- **CPI Architecture**: Seamless interaction between all 5 programs
- **Shared State**: Consistent data across program boundaries
- **Atomic Operations**: Ensuring data integrity across complex workflows

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [zk-Compression](https://www.zkcompression.com/)
- [Helius RPC](https://www.helius.xyz/)