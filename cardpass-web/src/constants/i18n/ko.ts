export const dict = {
	nav: {
		home: "홈",
		profiles: "인재",
		jobs: "채용",
		resumes: "레쥬메",
		about: "소개",
		connectWallet: "지갑 연결",
	},
	home: {
		title: "CardPass에 오신 것을 환영합니다",
		subtitle: "솔라나 기반 전문 네트워킹",
		description:
			"CardPass는 스팸을 차단하고 가치 있는 연결에 보상하는 블록체인 기반 차세대 네트워킹 플랫폼입니다",
		cta: "지갑 연결 & 시작하기",
		browseJobs: "채용 정보 보기",
		features: {
			title: "핵심 기능",
			subtitle: "블록체인으로 구현된 신뢰할 수 있는 네트워킹",
			contactGate: {
				title: "컨택 게이트",
				description: "스팸 없는 전문 네트워킹",
				details: "연락 요청 시 예치금 필요, 응답 시 환불",
			},
			introRewards: {
				title: "소개 리워드",
				description: "성공적인 소개에 대한 자동 보상",
				details: "채용 성공 시 에스크로 기반 자동 정산",
			},
			digitalCards: {
				title: "cNFT 명함",
				description: "블록체인 기반 디지털 명함",
				details: "QR 코드로 쉽게 공유 가능한 검증된 프로필",
			},
		},
		howItWorks: {
			title: "이용 방법",
			subtitle: "3단계로 간단하게 시작하세요",
			steps: [
				{
					title: "프로필 생성",
					description: "cNFT 명함을 발급하고 연락 가격을 설정하세요",
				},
				{
					title: "네트워킹",
					description: "가치 있는 연락처를 교환하고 네트워크를 확장하세요",
				},
				{
					title: "보상 획득",
					description: "응답이나 성공적인 추천에 대한 자동 보상을 받으세요",
				},
			],
		},
		userTypes: {
			title: "모두를 위한 가치",
			subtitle: "역할에 맞는 혜택",
			professionals: {
				title: "전문가",
				benefits: [
					"스팸 없는 깨끗한 받은편지함",
					"진짜 연락만 수신",
					"연락 요청으로 수익 창출",
				],
			},
			recruiters: {
				title: "리크루터",
				benefits: [
					"검증된 인재와 직접 연락",
					"보장된 응답률",
					"소개를 통한 인재풀 확대",
				],
			},
			referrers: {
				title: "추천인",
				benefits: [
					"성공적인 소개에 대한 자동 보상",
					"투명한 보상 시스템",
					"네트워크 가치 수익화",
				],
			},
		},
		cta2: {
			title: "지금 시작하세요",
			subtitle:
				"CardPass에 가입하고 스팸 없는 전문 네트워킹의 새로운 기준을 경험하세요",
			button: "지갑 연결 & 명함 생성",
			note: "솔라나 지갑 필요 • 가스비 없는 cNFT 발행",
		},
		footer: {
			tagline: "솔라나 기반 전문 네트워킹",
			links: {
				docs: "문서",
				github: "깃허브",
				discord: "디스코드",
				twitter: "트위터",
			},
			copyright: "© 2024 CardPass. 솔라나로 구축됨.",
		},
	},
	about: {
		title: "CardPass 소개",
		description: "전문 네트워킹 플랫폼에 대해 자세히 알아보세요",
		mission: {
			title: "우리의 미션",
			content:
				"CardPass는 블록체인 기술을 활용하여 내장된 가치 교환 메커니즘으로 의미 있고 스팸 없는 연결을 만들어 전문 네트워킹을 혁신합니다.",
		},
		technology: {
			title: "기술 스택",
			content:
				"속도와 효율성을 위해 솔라나에 구축되었으며, 지속 가능한 디지털 신원을 위한 압축 NFT와 자동화된 가치 분배를 위한 스마트 컨트랙트를 사용합니다.",
		},
		contact: {
			title: "연락처",
			email: "이메일: contact@cardpass.io",
			twitter: "트위터: @cardpass",
		},
	},
	jobs: {
		title: "채용 공고",
		subtitle: "소개 성공 시 자동으로 바운티를 받으세요",
		searchPlaceholder: "직무, 회사, 기술 스택 검색...",
		filterAll: "모든 유형",
		filterFullTime: "정규직",
		filterContract: "계약직",
		filterFreelance: "프리랜서",
		bountyLabel: "소개 바운티",
		applyButton: "지원하기",
		createReferralButton: "소개 링크 생성",
		viewDetails: "상세 보기",
		noResults: "검색 결과가 없습니다",
		postedPrefix: "", // Empty in Korean as it's already included in the data
		jobList: [
			{
				id: "1",
				title: "시니어 프론트엔드 개발자",
				company: "테크코프 코리아",
				location: "서울, 강남구",
				type: "정규직",
				bounty: 500,
				posted: "2일 전",
				description: "React/Vue.js 경험 3년 이상, 블록체인 프로젝트 경험 우대",
				tags: ["React", "TypeScript", "Web3"],
			},
			{
				id: "2",
				title: "블록체인 엔지니어",
				company: "디파이 랩스",
				location: "원격근무",
				type: "정규직",
				bounty: 800,
				posted: "3일 전",
				description: "Solana/Ethereum 개발 경험 필수, Rust/Solidity 능통자",
				tags: ["Solana", "Rust", "DeFi"],
			},
			{
				id: "3",
				title: "프로덕트 디자이너",
				company: "스타트업 허브",
				location: "서울, 성수동",
				type: "정규직",
				bounty: 400,
				posted: "1주일 전",
				description: "Web3 프로덕트 디자인 경험, Figma 숙련자",
				tags: ["UI/UX", "Figma", "Web3"],
			},
			{
				id: "4",
				title: "풀스택 개발자",
				company: "핀테크 솔루션즈",
				location: "부산",
				type: "계약직",
				bounty: 600,
				posted: "4일 전",
				description: "Node.js, React, PostgreSQL 경험 필수",
				tags: ["Node.js", "React", "PostgreSQL"],
			},
			{
				id: "5",
				title: "스마트 컨트랙트 개발자",
				company: "NFT 스튜디오",
				location: "원격근무",
				type: "프리랜서",
				bounty: 1000,
				posted: "1일 전",
				description: "NFT 마켓플레이스 개발 경험, Solidity/Rust 필수",
				tags: ["Solidity", "NFT", "Smart Contract"],
			},
		],
	},
	common: {
		loading: "로딩 중...",
		error: "오류가 발생했습니다",
		notFound: "페이지를 찾을 수 없습니다",
		backHome: "홈으로 돌아가기",
	},
} as const;
