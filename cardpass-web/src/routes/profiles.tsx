import { createMemo, createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/contexts/i18n";

interface Profile {
	id: string;
	handle: string;
	name: string;
	title: string;
	company: string;
	location: string;
	bio: string;
	skills: string[];
	contactPrice: number;
	responseTime: string;
	verified: boolean;
	avatar?: string;
	experience: string;
	languages: string[];
	isAvailable: boolean;
}

export default function Profiles() {
	const { t, locale } = useI18n();
	const [searchTerm, setSearchTerm] = createSignal("");
	const [filterSkill, setFilterSkill] = createSignal("all");
	const [filterAvailability, setFilterAvailability] = createSignal("all");
	const [viewMode, setViewMode] = createSignal<"grid" | "list">("grid");

	// Mock profile data
	const profiles = createMemo<Profile[]>(() => [
		{
			id: "1",
			handle: "alex-kim",
			name: locale() === "ko" ? "김알렉스" : "Alex Kim",
			title: locale() === "ko" ? "시니어 프론트엔드 개발자" : "Senior Frontend Developer",
			company: "TechCorp",
			location: locale() === "ko" ? "서울, 한국" : "Seoul, Korea",
			bio: locale() === "ko"
				? "10년 경력의 프론트엔드 전문가. React, Vue, Solid 경험 다수"
				: "10 years of frontend expertise. Extensive experience with React, Vue, and Solid",
			skills: ["React", "TypeScript", "Solana", "Web3"],
			contactPrice: 50,
			responseTime: locale() === "ko" ? "24시간 이내" : "Within 24 hours",
			verified: true,
			experience: locale() === "ko" ? "10년" : "10 years",
			languages: locale() === "ko" ? ["한국어", "영어"] : ["Korean", "English"],
			isAvailable: true,
		},
		{
			id: "2",
			handle: "sarah-chen",
			name: locale() === "ko" ? "사라 첸" : "Sarah Chen",
			title: locale() === "ko" ? "블록체인 개발자" : "Blockchain Developer",
			company: "DeFi Labs",
			location: locale() === "ko" ? "싱가포르" : "Singapore",
			bio: locale() === "ko"
				? "솔라나 및 이더리움 전문 개발자. DeFi 프로토콜 다수 개발"
				: "Specialized in Solana and Ethereum. Built multiple DeFi protocols",
			skills: ["Solana", "Rust", "Smart Contracts", "DeFi"],
			contactPrice: 100,
			responseTime: locale() === "ko" ? "48시간 이내" : "Within 48 hours",
			verified: true,
			experience: locale() === "ko" ? "7년" : "7 years",
			languages: locale() === "ko" ? ["영어", "중국어"] : ["English", "Chinese"],
			isAvailable: true,
		},
		{
			id: "3",
			handle: "john-park",
			name: locale() === "ko" ? "박존" : "John Park",
			title: locale() === "ko" ? "풀스택 개발자" : "Full Stack Developer",
			company: "Startup Inc",
			location: locale() === "ko" ? "부산, 한국" : "Busan, Korea",
			bio: locale() === "ko"
				? "스타트업 경험 다수. 빠른 프로토타이핑과 MVP 개발 전문"
				: "Multiple startup experience. Specialized in rapid prototyping and MVP development",
			skills: ["Node.js", "React", "PostgreSQL", "AWS"],
			contactPrice: 30,
			responseTime: locale() === "ko" ? "12시간 이내" : "Within 12 hours",
			verified: false,
			experience: locale() === "ko" ? "5년" : "5 years",
			languages: locale() === "ko" ? ["한국어", "영어", "일본어"] : ["Korean", "English", "Japanese"],
			isAvailable: true,
		},
		{
			id: "4",
			handle: "maria-garcia",
			name: locale() === "ko" ? "마리아 가르시아" : "Maria Garcia",
			title: locale() === "ko" ? "UI/UX 디자이너" : "UI/UX Designer",
			company: "Design Studio",
			location: locale() === "ko" ? "바르셀로나, 스페인" : "Barcelona, Spain",
			bio: locale() === "ko"
				? "사용자 중심 디자인 전문가. Web3 프로젝트 디자인 경험"
				: "User-centered design expert. Experience with Web3 project designs",
			skills: ["Figma", "Design Systems", "Web3 UX", "Prototyping"],
			contactPrice: 75,
			responseTime: locale() === "ko" ? "24시간 이내" : "Within 24 hours",
			verified: true,
			experience: locale() === "ko" ? "8년" : "8 years",
			languages: locale() === "ko" ? ["스페인어", "영어"] : ["Spanish", "English"],
			isAvailable: false,
		},
		{
			id: "5",
			handle: "david-wong",
			name: locale() === "ko" ? "데이비드 웡" : "David Wong",
			title: locale() === "ko" ? "DevOps 엔지니어" : "DevOps Engineer",
			company: "Cloud Systems",
			location: locale() === "ko" ? "도쿄, 일본" : "Tokyo, Japan",
			bio: locale() === "ko"
				? "클라우드 인프라 및 CI/CD 파이프라인 전문가"
				: "Cloud infrastructure and CI/CD pipeline specialist",
			skills: ["Kubernetes", "Docker", "AWS", "Terraform"],
			contactPrice: 60,
			responseTime: locale() === "ko" ? "36시간 이내" : "Within 36 hours",
			verified: true,
			experience: locale() === "ko" ? "6년" : "6 years",
			languages: locale() === "ko" ? ["영어", "중국어", "일본어"] : ["English", "Chinese", "Japanese"],
			isAvailable: true,
		},
	]);

	// Get unique skills for filter
	const allSkills = createMemo(() => {
		const skills = new Set<string>();
		profiles().forEach(profile => {
			profile.skills.forEach(skill => skills.add(skill));
		});
		return Array.from(skills).sort();
	});

	// Filter profiles
	const filteredProfiles = createMemo(() => {
		return profiles().filter(profile => {
			const matchesSearch =
				profile.name.toLowerCase().includes(searchTerm().toLowerCase()) ||
				profile.title.toLowerCase().includes(searchTerm().toLowerCase()) ||
				profile.company.toLowerCase().includes(searchTerm().toLowerCase()) ||
				profile.bio.toLowerCase().includes(searchTerm().toLowerCase()) ||
				profile.skills.some(skill =>
					skill.toLowerCase().includes(searchTerm().toLowerCase())
				);

			const matchesSkill =
				filterSkill() === "all" ||
				profile.skills.includes(filterSkill());

			const matchesAvailability =
				filterAvailability() === "all" ||
				(filterAvailability() === "available" && profile.isAvailable) ||
				(filterAvailability() === "unavailable" && !profile.isAvailable);

			return matchesSearch && matchesSkill && matchesAvailability;
		});
	});

	return (
		<main class="min-h-screen bg-gradient-to-b from-gray-900 to-black">
			<div class="container mx-auto px-4 py-12">
				{/* Header */}
				<div class="mb-12">
					<h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
						{locale() === "ko" ? "인재 디렉토리" : "Talent Directory"}
					</h1>
					<p class="text-xl text-gray-400">
						{locale() === "ko"
							? "검증된 전문가들과 직접 연결하세요"
							: "Connect directly with verified professionals"}
					</p>
				</div>

				{/* Search and Filters */}
				<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mb-8">
					<div class="flex flex-col md:flex-row gap-4 mb-4">
						<div class="flex-1">
							<input
								type="text"
								placeholder={locale() === "ko"
									? "이름, 직무, 기술로 검색..."
									: "Search by name, role, or skills..."}
								value={searchTerm()}
								onInput={(e) => setSearchTerm(e.currentTarget.value)}
								class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
							/>
						</div>
						<select
							value={filterSkill()}
							onChange={(e) => setFilterSkill(e.currentTarget.value)}
							class="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
						>
							<option value="all">
								{locale() === "ko" ? "모든 기술" : "All Skills"}
							</option>
							<For each={allSkills()}>
								{(skill) => <option value={skill}>{skill}</option>}
							</For>
						</select>
						<select
							value={filterAvailability()}
							onChange={(e) => setFilterAvailability(e.currentTarget.value)}
							class="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
						>
							<option value="all">
								{locale() === "ko" ? "모든 상태" : "All Status"}
							</option>
							<option value="available">
								{locale() === "ko" ? "연락 가능" : "Available"}
							</option>
							<option value="unavailable">
								{locale() === "ko" ? "연락 불가" : "Unavailable"}
							</option>
						</select>
					</div>

					{/* View Mode Toggle */}
					<div class="flex items-center gap-2">
						<span class="text-gray-400 text-sm">
							{locale() === "ko" ? "보기 모드:" : "View:"}
						</span>
						<button
							type="button"
							onClick={() => setViewMode("grid")}
							class={`p-2 rounded-lg transition-colors ${
								viewMode() === "grid"
									? "bg-violet-600 text-white"
									: "bg-gray-800 text-gray-400 hover:text-white"
							}`}
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
							</svg>
						</button>
						<button
							type="button"
							onClick={() => setViewMode("list")}
							class={`p-2 rounded-lg transition-colors ${
								viewMode() === "list"
									? "bg-violet-600 text-white"
									: "bg-gray-800 text-gray-400 hover:text-white"
							}`}
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>

				{/* Profile Grid/List */}
				<Show
					when={filteredProfiles().length > 0}
					fallback={
						<div class="text-center py-20">
							<p class="text-gray-400 text-lg">
								{locale() === "ko" ? "검색 결과가 없습니다" : "No profiles found"}
							</p>
						</div>
					}
				>
					<div class={viewMode() === "grid"
						? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
						: "space-y-6"
					}>
						<For each={filteredProfiles()}>
							{(profile) => (
								<A
									href={`/r/${profile.handle}`}
									class={`group block bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-violet-500/50 p-6 transition-all hover:shadow-xl hover:shadow-violet-500/10 ${
										viewMode() === "list" ? "flex gap-6" : ""
									}`}
								>
									<div class={viewMode() === "list" ? "flex-1" : ""}>
										{/* Profile Header */}
										<div class="flex items-start justify-between mb-4">
											<div class="flex items-start gap-3">
												{/* Avatar */}
												<div class="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 flex items-center justify-center text-white font-bold">
													{profile.name.charAt(0)}
												</div>
												<div>
													<h3 class="text-xl font-bold text-white group-hover:text-violet-400 transition-colors flex items-center gap-2">
														{profile.name}
														<Show when={profile.verified}>
															<svg class="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
																<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
															</svg>
														</Show>
													</h3>
													<p class="text-gray-400">@{profile.handle}</p>
												</div>
											</div>
											<Show when={profile.isAvailable}>
												<span class="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-800">
													{locale() === "ko" ? "연락가능" : "Available"}
												</span>
											</Show>
										</div>

										{/* Title and Company */}
										<div class="mb-3">
											<p class="text-white font-medium">{profile.title}</p>
											<p class="text-gray-400 text-sm">
												{profile.company} • {profile.location}
											</p>
										</div>

										{/* Bio */}
										<p class="text-gray-400 text-sm mb-4 line-clamp-2">
											{profile.bio}
										</p>

										{/* Skills */}
										<div class="flex flex-wrap gap-2 mb-4">
											<For each={profile.skills.slice(0, viewMode() === "grid" ? 3 : 5)}>
												{(skill) => (
													<span class="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700">
														{skill}
													</span>
												)}
											</For>
											<Show when={profile.skills.length > (viewMode() === "grid" ? 3 : 5)}>
												<span class="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700">
													+{profile.skills.length - (viewMode() === "grid" ? 3 : 5)}
												</span>
											</Show>
										</div>

										{/* Contact Info */}
										<div class="flex items-center justify-between text-sm">
											<div class="flex items-center gap-4">
												<span class="text-gray-400">
													{locale() === "ko" ? "연락 비용:" : "Contact:"}
													<span class="text-violet-400 font-medium ml-1">
														{profile.contactPrice} USDC
													</span>
												</span>
												<span class="text-gray-400">
													{locale() === "ko" ? "응답:" : "Response:"}
													<span class="text-gray-300 ml-1">
														{profile.responseTime}
													</span>
												</span>
											</div>
										</div>

										{/* Additional Info for List View */}
										<Show when={viewMode() === "list"}>
											<div class="mt-4 flex items-center gap-4 text-sm text-gray-400">
												<span>
													{locale() === "ko" ? "경력:" : "Experience:"} {profile.experience}
												</span>
												<span>•</span>
												<span>
													{locale() === "ko" ? "언어:" : "Languages:"} {profile.languages.join(", ")}
												</span>
											</div>
										</Show>
									</div>
								</A>
							)}
						</For>
					</div>
				</Show>

				{/* Results Count */}
				<div class="mt-8 text-center text-gray-400">
					{locale() === "ko"
						? `${filteredProfiles().length}명의 전문가가 검색되었습니다`
						: `Found ${filteredProfiles().length} professionals`}
				</div>
			</div>
		</main>
	);
}