export const dict = {
	nav: {
		home: "Home",
		profiles: "Profiles",
		jobs: "Jobs",
		resumes: "Resumes",
		about: "About",
		connectWallet: "Connect Wallet",
	},
	home: {
		title: "Welcome to CardPass",
		subtitle: "Professional Networking on Solana",
		description:
			"CardPass is a blockchain-based next-generation networking platform that blocks spam and rewards valuable connections",
		cta: "Connect Wallet & Start",
		browseJobs: "Browse Jobs",
		features: {
			title: "Core Features",
			subtitle: "Trusted networking powered by blockchain",
			contactGate: {
				title: "Contact Gate",
				description: "Spam-free professional networking",
				details: "Contact requests require a deposit, refunded upon response",
			},
			introRewards: {
				title: "Intro Rewards",
				description: "Automatic rewards for successful introductions",
				details: "Escrow-based automatic settlement upon hiring success",
			},
			digitalCards: {
				title: "cNFT Business Cards",
				description: "Blockchain-based digital business cards",
				details: "Verified profiles easily shared via QR codes",
			},
		},
		howItWorks: {
			title: "How It Works",
			subtitle: "Get started in 3 simple steps",
			steps: [
				{
					title: "Create Profile",
					description:
						"Issue your cNFT business card and set your contact price",
				},
				{
					title: "Network",
					description: "Exchange valuable contacts and expand your network",
				},
				{
					title: "Earn Rewards",
					description:
						"Get automatic rewards for responding or successful referrals",
				},
			],
		},
		userTypes: {
			title: "Value for Everyone",
			subtitle: "Benefits tailored to your role",
			professionals: {
				title: "Professionals",
				benefits: [
					"Clean inbox without spam",
					"Receive only genuine contacts",
					"Generate revenue from contact requests",
				],
			},
			recruiters: {
				title: "Recruiters",
				benefits: [
					"Direct contact with verified talent",
					"Guaranteed response rate",
					"Expand talent pool through introductions",
				],
			},
			referrers: {
				title: "Referrers",
				benefits: [
					"Automatic rewards for successful introductions",
					"Transparent reward system",
					"Monetize your network value",
				],
			},
		},
		cta2: {
			title: "Start Now",
			subtitle:
				"Join CardPass and experience the new standard of spam-free professional networking",
			button: "Connect Wallet & Create Card",
			note: "Solana wallet required • Gas-free cNFT issuance",
		},
		footer: {
			tagline: "Professional Networking on Solana",
			links: {
				docs: "Docs",
				github: "GitHub",
				discord: "Discord",
				twitter: "Twitter",
			},
			copyright: "© 2024 CardPass. Built with Solana.",
		},
	},
	about: {
		title: "About CardPass",
		description: "Learn more about our professional networking platform",
		mission: {
			title: "Our Mission",
			content:
				"CardPass revolutionizes professional networking by leveraging blockchain technology to create meaningful, spam-free connections with built-in value exchange mechanisms.",
		},
		technology: {
			title: "Technology Stack",
			content:
				"Built on Solana for speed and efficiency, using compressed NFTs for sustainable digital identity, and smart contracts for automated value distribution.",
		},
		contact: {
			title: "Contact Us",
			email: "Email: contact@cardpass.io",
			twitter: "Twitter: @cardpass",
		},
	},
	jobs: {
		title: "Job Openings",
		subtitle: "Get automatic bounties on successful introductions",
		searchPlaceholder: "Search jobs, companies, tech stack...",
		filterAll: "All Types",
		filterFullTime: "Full-time",
		filterContract: "Contract",
		filterFreelance: "Freelance",
		bountyLabel: "Referral Bounty",
		applyButton: "Apply",
		createReferralButton: "Create Referral Link",
		viewDetails: "View Details",
		noResults: "No search results",
		postedPrefix: "", // Empty as it's included in the data
		jobList: [
			{
				id: "1",
				title: "Senior Frontend Developer",
				company: "TechCorp Korea",
				location: "Seoul, Gangnam",
				type: "Full-time",
				bounty: 500,
				posted: "2 days ago",
				description:
					"3+ years React/Vue.js experience, blockchain project experience preferred",
				tags: ["React", "TypeScript", "Web3"],
			},
			{
				id: "2",
				title: "Blockchain Engineer",
				company: "DeFi Labs",
				location: "Remote",
				type: "Full-time",
				bounty: 800,
				posted: "3 days ago",
				description:
					"Solana/Ethereum development experience required, proficient in Rust/Solidity",
				tags: ["Solana", "Rust", "DeFi"],
			},
			{
				id: "3",
				title: "Product Designer",
				company: "Startup Hub",
				location: "Seoul, Seongsu",
				type: "Full-time",
				bounty: 400,
				posted: "1 week ago",
				description: "Web3 product design experience, proficient in Figma",
				tags: ["UI/UX", "Figma", "Web3"],
			},
			{
				id: "4",
				title: "Full Stack Developer",
				company: "FinTech Solutions",
				location: "Busan",
				type: "Contract",
				bounty: 600,
				posted: "4 days ago",
				description: "Node.js, React, PostgreSQL experience required",
				tags: ["Node.js", "React", "PostgreSQL"],
			},
			{
				id: "5",
				title: "Smart Contract Developer",
				company: "NFT Studio",
				location: "Remote",
				type: "Freelance",
				bounty: 1000,
				posted: "1 day ago",
				description:
					"NFT marketplace development experience, Solidity/Rust required",
				tags: ["Solidity", "NFT", "Smart Contract"],
			},
		],
	},
	common: {
		loading: "Loading...",
		error: "An error occurred",
		notFound: "Page not found",
		backHome: "Back to Home",
	},
} as const;
