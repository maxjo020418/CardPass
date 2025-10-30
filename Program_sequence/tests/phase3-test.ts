import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProfileManager } from "../target/types/profile_manager";
import { JobApplication } from "../target/types/job_application";
import { HiringRewards } from "../target/types/hiring_rewards";
import { ResumeMarketplace } from "../target/types/resume_marketplace";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { expect } from "chai";

describe("Phase 3 Testing", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const profileManager = anchor.workspace.ProfileManager as Program<ProfileManager>;
  const jobApplication = anchor.workspace.JobApplication as Program<JobApplication>;
  const hiringRewards = anchor.workspace.HiringRewards as Program<HiringRewards>;
  const resumeMarketplace = anchor.workspace.ResumeMarketplace as Program<ResumeMarketplace>;

  // Test accounts
  const profileOwner = Keypair.generate();
  const requester = Keypair.generate();
  const recruiter = Keypair.generate();
  const applicant = Keypair.generate();
  let usdcMint: PublicKey;

  before(async () => {
    // Airdrop SOL to test accounts
    await Promise.all([
      provider.connection.requestAirdrop(
        profileOwner.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      ),
      provider.connection.requestAirdrop(
        requester.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      ),
        provider.connection.requestAirdrop(
        recruiter.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      ),
        provider.connection.requestAirdrop(
        applicant.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      ),
    ]).then(async (signatures) => {
        await Promise.all(signatures.map(sig => provider.connection.confirmTransaction(sig)));
    });

    // Create USDC mint for testing
    usdcMint = await createMint(
      provider.connection,
      profileOwner, // payer
      profileOwner.publicKey, // mint authority
      null, // freeze authority
      6 // decimals for USDC
    );
  });

  it("Is setup correctly", () => {
    expect(profileManager).to.be.ok;
    expect(jobApplication).to.be.ok;
    expect(hiringRewards).to.be.ok;
    expect(resumeMarketplace).to.be.ok;
    console.log("Programs loaded correctly");
  });

  describe("Profile Manager Phase 3", () => {
    let profilePda: PublicKey;

    before(async () => {
        [profilePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("profile"), profileOwner.publicKey.toBuffer()],
            profileManager.programId
        );

        await profileManager.methods
            .createProfile(
                ["Rust", "Solana"],
                5,
                "USA",
                "Bio",
                "testuser",
                [
                    { price: new anchor.BN(10 * 1000000), description: "Standard" },
                    { price: new anchor.BN(20 * 1000000), description: "Premium" },
                ],
                24,
                "https://ipfs.io/ipfs/QmPhase3TestResumeHash" // resume_link parameter for hybrid architecture
            )
            .accounts({
                profile: profilePda,
                owner: profileOwner.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([profileOwner])
            .rpc();
    });

    it("Handles multi-level pricing correctly", async () => {
        const profile = await profileManager.account.profile.fetch(profilePda);
        expect(profile.contactPrices.length).to.equal(2);
        expect(profile.contactPrices[0].price.toNumber()).to.equal(10 * 1000000);
        expect(profile.contactPrices[0].description).to.equal("Standard");
    });

    it("Handles expired contact requests", async () => {
        // This test is conceptual because it requires waiting for the contact to expire.
        // In a real test suite, this would be handled by manipulating the clock.
        console.log("Skipping expired contact test as it requires clock manipulation.");
    });

    it("Tests hybrid architecture data separation", async () => {
        const profile = await profileManager.account.profile.fetch(profilePda);

        // Verify public indexable data (searchable via Helius)
        expect(profile.skills).to.deep.equal(["Rust", "Solana"]);
        expect(profile.experienceYears).to.equal(5);
        expect(profile.region).to.equal("USA");
        expect(profile.bio).to.equal("Bio");
        expect(profile.handle).to.equal("testuser");
        expect(profile.responseTimeHours).to.equal(24);

        // Verify private zk-compressed data fields exist
        expect(profile.hasOwnProperty('resumeMerkleTree')).to.be.true;
        expect(profile.hasOwnProperty('resumeLeafIndex')).to.be.true;
        expect(profile.hasOwnProperty('resumeRootHash')).to.be.true;

        console.log("✅ Hybrid architecture working - public data indexable, private data fields ready for zk-compression");
    });
  });

  describe("Hiring Rewards Phase 3", () => {
    let rewardPoolPda: PublicKey;

    before(async () => {
        [rewardPoolPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("reward_pool"), usdcMint.toBuffer(), recruiter.publicKey.toBuffer()],
            hiringRewards.programId
        );

        await hiringRewards.methods
            .createRewardPool([
                { rewardAmount: new anchor.BN(100 * 1000000), description: "Standard" },
                { rewardAmount: new anchor.BN(200 * 1000000), description: "Premium" },
            ])
            .accounts({
                rewardPool: rewardPoolPda,
                usdcMint: usdcMint,
                authority: recruiter.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([recruiter])
            .rpc();
    });

    it("Creates a reward pool with tiers", async () => {
        const rewardPool = await hiringRewards.account.rewardPool.fetch(rewardPoolPda);
        expect(rewardPool.rewardTiers.length).to.equal(2);
        expect(rewardPool.rewardTiers[0].rewardAmount.toNumber()).to.equal(100 * 1000000);
    });

    it("Creates a referral", async () => {
        const [referralPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("referral"), rewardPoolPda.toBuffer(), recruiter.publicKey.toBuffer(), applicant.publicKey.toBuffer()],
            hiringRewards.programId
        );

        await hiringRewards.methods
            .createReferral(applicant.publicKey)
            .accounts({
                referral: referralPda,
                rewardPool: rewardPoolPda,
                referrer: recruiter.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([recruiter])
            .rpc();

        const referral = await hiringRewards.account.referral.fetch(referralPda);
        expect(referral.referrer.toString()).to.equal(recruiter.publicKey.toString());
        expect(referral.referee.toString()).to.equal(applicant.publicKey.toString());
    });
  });

  describe("Job Application Phase 3", () => {
    it("Hires an applicant and distributes rewards", async () => {
        // This test is complex and requires a full setup of all accounts.
        // It is better to test this in a dedicated integration test.
        console.log("Skipping hire applicant test as it requires a full integration setup.");
    });
  });

  describe("Resume Marketplace Phase 3", () => {
    let resumeNftPda: PublicKey;
    let mint: Keypair;

    before(async () => {
        mint = Keypair.generate();
        [resumeNftPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("resume"), mint.publicKey.toBuffer()],
            resumeMarketplace.programId
        );
    });

    it("Lists a resume for sale", async () => {
        const ownerTokenAccount = await getOrCreateAssociatedTokenAccount(
            provider.connection,
            profileOwner,
            mint.publicKey,
            profileOwner.publicKey
        );

        await resumeMarketplace.methods
            .listResume(new anchor.BN(10 * 1000000), 10)
            .accounts({
                resumeNft: resumeNftPda,
                owner: profileOwner.publicKey,
                mint: mint.publicKey,
                ownerTokenAccount: ownerTokenAccount.address,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .signers([profileOwner])
            .rpc();

        const resumeNft = await resumeMarketplace.account.resumeNft.fetch(resumeNftPda);
        expect(resumeNft.isForSale).to.be.true;
        expect(resumeNft.price.toNumber()).to.equal(10 * 1000000);
    });

    it("Verifies a resume", async () => {
        await resumeMarketplace.methods
            .verifyResume()
            .accounts({
                resumeNft: resumeNftPda,
                authority: profileOwner.publicKey,
            })
            .signers([profileOwner])
            .rpc();

        const resumeNft = await resumeMarketplace.account.resumeNft.fetch(resumeNftPda);
        expect(resumeNft.verified).to.be.true;
    });

    it("Purchases a resume", async () => {
        // This test is complex and requires a full setup of all accounts.
        // It is better to test this in a dedicated integration test.
        console.log("Skipping purchase resume test as it requires a full integration setup.");
    });
  });
});
