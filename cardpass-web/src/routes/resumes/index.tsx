import { createMemo, createSignal, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/contexts/i18n";

interface Resume {
	id: string;
	title: string;
	company: string;
	position: string;
	result: string;
	industry: string;
	experience: string;
	salary: string;
	price: number;
	soldCount: number;
	rating: number;
	reviewCount: number;
	tags: string[];
	preview: string;
	successDate: string;
	anonymous: boolean;
}

export default function Resumes() {
	const { t, locale } = useI18n();
	const [searchTerm, setSearchTerm] = createSignal("");
	const [filterIndustry, setFilterIndustry] = createSignal("all");
	const [filterExperience, setFilterExperience] = createSignal("all");
	const [sortBy, setSortBy] = createSignal("popular");

	// Mock resume data
	const resumes = createMemo<Resume[]>(() => [
		{
			id: "1",
			title: locale() === "ko"
				? "비전공자에서 네이버 프론트엔드 개발자까지"
				: "From Non-CS to Naver Frontend Developer",
			company: locale() === "ko" ? "네이버" : "Naver",
			position: locale() === "ko" ? "프론트엔드 개발자" : "Frontend Developer",
			result: locale() === "ko" ? "최종 합격" : "Final Offer",
			industry: locale() === "ko" ? "IT/인터넷" : "IT/Internet",
			experience: locale() === "ko" ? "신입" : "Entry Level",
			salary: locale() === "ko" ? "5,000만원" : "$50,000",
			price: 15,
			soldCount: 234,
			rating: 4.8,
			reviewCount: 89,
			tags: ["React", "TypeScript", locale() === "ko" ? "코딩테스트" : "Coding Test", locale() === "ko" ? "포트폴리오" : "Portfolio"],
			preview: locale() === "ko"
				? "비전공자 출신으로 독학과 부트캠프를 통해 프론트엔드 개발을 학습했습니다. 6개월간의 집중적인 준비 끝에..."
				: "As a non-CS major, I learned frontend development through self-study and bootcamp. After 6 months of intensive preparation...",
			successDate: "2024-01",
			anonymous: true,
		},
		{
			id: "2",
			title: locale() === "ko"
				? "스타트업에서 유니콘까지: 토스 시니어 개발자 합격기"
				: "From Startup to Unicorn: Toss Senior Developer Success Story",
			company: locale() === "ko" ? "토스" : "Toss",
			position: locale() === "ko" ? "시니어 백엔드 개발자" : "Senior Backend Developer",
			result: locale() === "ko" ? "최종 합격" : "Final Offer",
			industry: locale() === "ko" ? "핀테크" : "Fintech",
			experience: locale() === "ko" ? "7년차" : "7 Years",
			salary: locale() === "ko" ? "1.2억원" : "$120,000",
			price: 25,
			soldCount: 156,
			rating: 4.9,
			reviewCount: 67,
			tags: ["Java", "Spring", "MSA", locale() === "ko" ? "시스템설계" : "System Design"],
			preview: locale() === "ko"
				? "중소 스타트업에서 7년간 백엔드 개발자로 일하며 다양한 프로젝트를 리드했습니다. 토스의 기술 철학과..."
				: "Worked as a backend developer at small startups for 7 years, leading various projects. Toss's technical philosophy and...",
			successDate: "2024-02",
			anonymous: true,
		},
		{
			id: "3",
			title: locale() === "ko"
				? "외국계 IT 기업 데이터 사이언티스트 전직 성공"
				: "Successfully Transitioned to Data Scientist at Global IT Company",
			company: "Microsoft",
			position: locale() === "ko" ? "데이터 사이언티스트" : "Data Scientist",
			result: locale() === "ko" ? "최종 합격" : "Final Offer",
			industry: locale() === "ko" ? "IT/소프트웨어" : "IT/Software",
			experience: locale() === "ko" ? "5년차" : "5 Years",
			salary: locale() === "ko" ? "1억원" : "$100,000",
			price: 20,
			soldCount: 198,
			rating: 4.7,
			reviewCount: 78,
			tags: ["Python", "ML/AI", "SQL", locale() === "ko" ? "영어면접" : "English Interview"],
			preview: locale() === "ko"
				? "국내 대기업에서 데이터 분석가로 5년간 근무 후 글로벌 기업으로의 전직을 준비했습니다. 영어 면접 준비와..."
				: "After 5 years as a data analyst at a Korean conglomerate, I prepared for a transition to a global company. English interview preparation and...",
			successDate: "2023-12",
			anonymous: true,
		},
		{
			id: "4",
			title: locale() === "ko"
				? "게임 회사 서버 개발자 이직 완벽 가이드"
				: "Complete Guide to Game Company Server Developer Job Change",
			company: "Nexon",
			position: locale() === "ko" ? "서버 개발자" : "Server Developer",
			result: locale() === "ko" ? "최종 합격" : "Final Offer",
			industry: locale() === "ko" ? "게임" : "Gaming",
			experience: locale() === "ko" ? "3년차" : "3 Years",
			salary: locale() === "ko" ? "7,000만원" : "$70,000",
			price: 18,
			soldCount: 145,
			rating: 4.6,
			reviewCount: 52,
			tags: ["C++", "Unity", locale() === "ko" ? "네트워크" : "Network", locale() === "ko" ? "실시간처리" : "Real-time"],
			preview: locale() === "ko"
				? "웹 개발에서 게임 서버 개발로 전향하며 겪은 도전과 극복 과정을 담았습니다. 게임 업계 특유의..."
				: "Contains the challenges and overcoming process of transitioning from web development to game server development. The unique aspects of the gaming industry...",
			successDate: "2024-01",
			anonymous: true,
		},
		{
			id: "5",
			title: locale() === "ko"
				? "디자이너에서 프로덕트 매니저로 커리어 전환"
				: "Career Transition from Designer to Product Manager",
			company: locale() === "ko" ? "카카오" : "Kakao",
			position: locale() === "ko" ? "프로덕트 매니저" : "Product Manager",
			result: locale() === "ko" ? "최종 합격" : "Final Offer",
			industry: locale() === "ko" ? "IT/플랫폼" : "IT/Platform",
			experience: locale() === "ko" ? "4년차" : "4 Years",
			salary: locale() === "ko" ? "8,000만원" : "$80,000",
			price: 22,
			soldCount: 167,
			rating: 4.8,
			reviewCount: 63,
			tags: [locale() === "ko" ? "프로덕트" : "Product", "UX/UI", locale() === "ko" ? "데이터분석" : "Data Analysis", "SQL"],
			preview: locale() === "ko"
				? "4년간 UX 디자이너로 일하며 프로덕트에 대한 이해를 쌓아왔습니다. PM으로의 전환을 위해..."
				: "Built product understanding while working as a UX designer for 4 years. For the transition to PM...",
			successDate: "2024-02",
			anonymous: true,
		},
	]);

	// Get unique industries for filter
	const industries = createMemo(() => {
		const uniqueIndustries = new Set<string>();
		resumes().forEach(resume => uniqueIndustries.add(resume.industry));
		return Array.from(uniqueIndustries).sort();
	});

	// Filter and sort resumes
	const filteredResumes = createMemo(() => {
		let filtered = resumes().filter(resume => {
			const matchesSearch =
				resume.title.toLowerCase().includes(searchTerm().toLowerCase()) ||
				resume.company.toLowerCase().includes(searchTerm().toLowerCase()) ||
				resume.position.toLowerCase().includes(searchTerm().toLowerCase()) ||
				resume.tags.some(tag => tag.toLowerCase().includes(searchTerm().toLowerCase()));

			const matchesIndustry =
				filterIndustry() === "all" || resume.industry === filterIndustry();

			const matchesExperience =
				filterExperience() === "all" || resume.experience === filterExperience();

			return matchesSearch && matchesIndustry && matchesExperience;
		});

		// Sort
		if (sortBy() === "popular") {
			filtered = filtered.sort((a, b) => b.soldCount - a.soldCount);
		} else if (sortBy() === "rating") {
			filtered = filtered.sort((a, b) => b.rating - a.rating);
		} else if (sortBy() === "price-low") {
			filtered = filtered.sort((a, b) => a.price - b.price);
		} else if (sortBy() === "price-high") {
			filtered = filtered.sort((a, b) => b.price - a.price);
		} else if (sortBy() === "recent") {
			filtered = filtered.sort((a, b) => b.successDate.localeCompare(a.successDate));
		}

		return filtered;
	});

	return (
		<main class="min-h-screen bg-gradient-to-b from-gray-900 to-black">
			<div class="container mx-auto px-4 py-12">
				{/* Header */}
				<div class="mb-12">
					<h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
						{locale() === "ko" ? "성공 레쥬메 마켓" : "Success Resume Market"}
					</h1>
					<p class="text-xl text-gray-400">
						{locale() === "ko"
							? "실제 합격으로 이어진 이력서와 노하우를 만나보세요"
							: "Discover resumes and know-how that led to actual job offers"}
					</p>
				</div>

				{/* Stats Banner */}
				<div class="bg-gradient-to-r from-violet-900/30 to-cyan-900/30 rounded-xl border border-violet-500/20 p-6 mb-8">
					<div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
						<div>
							<p class="text-3xl font-bold text-white mb-1">1,234</p>
							<p class="text-gray-400 text-sm">
								{locale() === "ko" ? "등록된 레쥬메" : "Listed Resumes"}
							</p>
						</div>
						<div>
							<p class="text-3xl font-bold text-white mb-1">8,901</p>
							<p class="text-gray-400 text-sm">
								{locale() === "ko" ? "총 판매 수" : "Total Sales"}
							</p>
						</div>
						<div>
							<p class="text-3xl font-bold text-white mb-1">4.7</p>
							<p class="text-gray-400 text-sm">
								{locale() === "ko" ? "평균 평점" : "Average Rating"}
							</p>
						</div>
						<div>
							<p class="text-3xl font-bold text-white mb-1">92%</p>
							<p class="text-gray-400 text-sm">
								{locale() === "ko" ? "구매 만족도" : "Satisfaction Rate"}
							</p>
						</div>
					</div>
				</div>

				{/* Search and Filters */}
				<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mb-8">
					<div class="flex flex-col lg:flex-row gap-4">
						<div class="flex-1">
							<input
								type="text"
								placeholder={locale() === "ko"
									? "회사, 직무, 기술 스택으로 검색..."
									: "Search by company, position, or skills..."}
								value={searchTerm()}
								onInput={(e) => setSearchTerm(e.currentTarget.value)}
								class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
							/>
						</div>
						<select
							value={filterIndustry()}
							onChange={(e) => setFilterIndustry(e.currentTarget.value)}
							class="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
						>
							<option value="all">
								{locale() === "ko" ? "모든 산업" : "All Industries"}
							</option>
							<For each={industries()}>
								{(industry) => <option value={industry}>{industry}</option>}
							</For>
						</select>
						<select
							value={filterExperience()}
							onChange={(e) => setFilterExperience(e.currentTarget.value)}
							class="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
						>
							<option value="all">
								{locale() === "ko" ? "모든 경력" : "All Experience"}
							</option>
							<option value={locale() === "ko" ? "신입" : "Entry Level"}>
								{locale() === "ko" ? "신입" : "Entry Level"}
							</option>
							<option value={locale() === "ko" ? "3년차" : "3 Years"}>
								{locale() === "ko" ? "3년차" : "3 Years"}
							</option>
							<option value={locale() === "ko" ? "5년차" : "5 Years"}>
								{locale() === "ko" ? "5년차" : "5 Years"}
							</option>
							<option value={locale() === "ko" ? "7년차" : "7 Years"}>
								{locale() === "ko" ? "7년차+" : "7+ Years"}
							</option>
						</select>
						<select
							value={sortBy()}
							onChange={(e) => setSortBy(e.currentTarget.value)}
							class="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
						>
							<option value="popular">
								{locale() === "ko" ? "인기순" : "Most Popular"}
							</option>
							<option value="rating">
								{locale() === "ko" ? "평점순" : "Highest Rated"}
							</option>
							<option value="recent">
								{locale() === "ko" ? "최신순" : "Most Recent"}
							</option>
							<option value="price-low">
								{locale() === "ko" ? "낮은 가격순" : "Price: Low to High"}
							</option>
							<option value="price-high">
								{locale() === "ko" ? "높은 가격순" : "Price: High to Low"}
							</option>
						</select>
					</div>
				</div>

				{/* Resume Grid */}
				<Show
					when={filteredResumes().length > 0}
					fallback={
						<div class="text-center py-20">
							<p class="text-gray-400 text-lg">
								{locale() === "ko" ? "검색 결과가 없습니다" : "No resumes found"}
							</p>
						</div>
					}
				>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<For each={filteredResumes()}>
							{(resume) => (
								<A
									href={`/resumes/${resume.id}`}
									class="group bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-violet-500/50 p-6 transition-all hover:shadow-xl hover:shadow-violet-500/10 flex flex-col"
								>
									{/* Header */}
									<div class="mb-4">
										<div class="flex items-start justify-between mb-2">
											<span class="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-800">
												{resume.result}
											</span>
											<div class="flex items-center gap-1">
												<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
													<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
												</svg>
												<span class="text-sm text-gray-300">{resume.rating}</span>
												<span class="text-xs text-gray-500">({resume.reviewCount})</span>
											</div>
										</div>
										<h3 class="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-violet-400 transition-colors">
											{resume.title}
										</h3>
										<div class="flex items-center gap-2 text-sm text-gray-400 mb-2">
											<span class="font-medium text-gray-300">{resume.company}</span>
											<span>•</span>
											<span>{resume.position}</span>
										</div>
										<div class="flex items-center gap-2 text-sm text-gray-400">
											<span>{resume.industry}</span>
											<span>•</span>
											<span>{resume.experience}</span>
											<span>•</span>
											<span>{locale() === "ko" ? "연봉 " : "Salary "}{resume.salary}</span>
										</div>
									</div>

									{/* Preview */}
									<p class="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
										{resume.preview}
									</p>

									{/* Tags */}
									<div class="flex flex-wrap gap-1 mb-4">
										<For each={resume.tags.slice(0, 3)}>
											{(tag) => (
												<span class="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700">
													{tag}
												</span>
											)}
										</For>
										<Show when={resume.tags.length > 3}>
											<span class="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700">
												+{resume.tags.length - 3}
											</span>
										</Show>
									</div>

									{/* Footer */}
									<div class="flex items-center justify-between pt-4 border-t border-gray-800">
										<div class="flex items-center gap-3">
											<div class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
												{resume.price} USDC
											</div>
											<div class="text-xs text-gray-500">
												{locale() === "ko" ? `${resume.soldCount}개 판매` : `${resume.soldCount} sold`}
											</div>
										</div>
										<button
											type="button"
											class="px-3 py-1 bg-violet-600/20 text-violet-400 text-sm rounded-lg hover:bg-violet-600/30 transition-colors"
											onClick={(e) => e.preventDefault()}
										>
											{locale() === "ko" ? "미리보기" : "Preview"}
										</button>
									</div>
								</A>
							)}
						</For>
					</div>
				</Show>

				{/* Results Count */}
				<div class="mt-8 text-center text-gray-400">
					{locale() === "ko"
						? `${filteredResumes().length}개의 레쥬메가 검색되었습니다`
						: `Found ${filteredResumes().length} resumes`}
				</div>

				{/* CTA Section */}
				<div class="mt-16 bg-gradient-to-r from-violet-900/20 to-cyan-900/20 rounded-xl border border-violet-500/20 p-8 text-center">
					<h2 class="text-2xl font-bold text-white mb-4">
						{locale() === "ko"
							? "당신의 성공 스토리를 공유하세요"
							: "Share Your Success Story"}
					</h2>
					<p class="text-gray-400 mb-6 max-w-2xl mx-auto">
						{locale() === "ko"
							? "합격한 이력서를 익명으로 판매하고 다른 구직자들에게 도움을 주며 수익을 창출하세요."
							: "Sell your successful resume anonymously and earn income while helping other job seekers."}
					</p>
					<A
						href="/me/monetization"
						class="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
					>
						{locale() === "ko" ? "레쥬메 판매 시작하기" : "Start Selling Your Resume"}
					</A>
				</div>
			</div>
		</main>
	);
}