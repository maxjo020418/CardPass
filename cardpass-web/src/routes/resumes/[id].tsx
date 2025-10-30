import { useParams, A } from "@solidjs/router";
import { createMemo, createSignal, Show, For } from "solid-js";
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
	// Detail fields
	fullDescription?: string;
	preparationPeriod?: string;
	applicationCount?: string;
	interviewRounds?: number;
	keyStrategies?: string[];
	challenges?: string[];
	tips?: string[];
	reviews?: {
		id: string;
		rating: number;
		comment: string;
		date: string;
		helpful: number;
	}[];
}

export default function ResumeDetail() {
	const { t, locale } = useI18n();
	const params = useParams();
	const [showPurchaseModal, setShowPurchaseModal] = createSignal(false);
	const [isPurchased, setIsPurchased] = createSignal(false);
	const [showFullContent, setShowFullContent] = createSignal(false);

	// Mock resume data
	const resume = createMemo<Resume | null>(() => {
		const resumes: Record<string, Resume> = {
			"1": {
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
					? "비전공자 출신으로 독학과 부트캠프를 통해 프론트엔드 개발을 학습했습니다. 6개월간의 집중적인 준비 끝에 네이버 신입 공채에 최종 합격할 수 있었습니다."
					: "As a non-CS major, I learned frontend development through self-study and bootcamp. After 6 months of intensive preparation, I successfully received a final offer from Naver's new graduate recruitment.",
				successDate: "2024-01",
				anonymous: true,
				fullDescription: locale() === "ko"
					? "경영학과를 졸업하고 마케팅 직무로 1년간 일하던 중, 웹 개발에 흥미를 느껴 커리어 전환을 결심했습니다. 처음에는 온라인 강의로 HTML/CSS부터 시작했고, 이후 부트캠프에 참여하여 React와 JavaScript를 체계적으로 학습했습니다.\n\n가장 어려웠던 부분은 컴퓨터 과학 기초 지식이 부족하다는 점이었습니다. 이를 극복하기 위해 알고리즘과 자료구조를 매일 2시간씩 공부했고, 실제 프로젝트를 만들며 실무 경험을 쌓았습니다.\n\n네이버 지원 과정에서는 포트폴리오 프로젝트 3개를 준비했고, 각 프로젝트마다 기술적 도전과제를 설정하여 깊이 있게 구현했습니다. 코딩테스트는 프로그래머스와 백준에서 총 500문제 이상을 풀며 준비했습니다."
					: "After graduating with a business degree and working in marketing for a year, I became interested in web development and decided to change careers. I started with HTML/CSS through online courses, then joined a bootcamp to systematically learn React and JavaScript.\n\nThe biggest challenge was my lack of computer science fundamentals. To overcome this, I studied algorithms and data structures for 2 hours daily and gained practical experience by building real projects.\n\nFor the Naver application, I prepared 3 portfolio projects, setting technical challenges for each to implement them deeply. I prepared for the coding test by solving over 500 problems on Programmers and Baekjoon.",
				preparationPeriod: locale() === "ko" ? "6개월" : "6 months",
				applicationCount: locale() === "ko" ? "12개 회사" : "12 companies",
				interviewRounds: 4,
				keyStrategies: locale() === "ko" ? [
					"매일 알고리즘 2문제씩 꾸준히 풀기",
					"실제 서비스와 유사한 포트폴리오 프로젝트 제작",
					"기술 블로그 운영으로 학습 내용 정리",
					"모의 면접 스터디 참여",
					"오픈소스 프로젝트 기여"
				] : [
					"Solve 2 algorithm problems daily",
					"Create portfolio projects similar to real services",
					"Maintain tech blog to organize learnings",
					"Participate in mock interview study groups",
					"Contribute to open source projects"
				],
				challenges: locale() === "ko" ? [
					"비전공자로서 CS 기초 지식 부족",
					"실무 경험 없는 신입으로서의 한계",
					"대기업 코딩테스트 난이도",
					"기술 면접에서의 깊이 있는 질문들"
				] : [
					"Lack of CS fundamentals as non-CS major",
					"Limitations as entry-level without work experience",
					"Difficulty of large company coding tests",
					"In-depth questions in technical interviews"
				],
				tips: locale() === "ko" ? [
					"기초를 탄탄히 다지는 것이 가장 중요",
					"포트폴리오는 양보다 질에 집중",
					"면접 준비는 예상 질문 리스트 작성부터",
					"불합격도 성장의 기회로 활용",
					"네트워킹을 통한 정보 수집"
				] : [
					"Building strong fundamentals is most important",
					"Focus on quality over quantity for portfolio",
					"Start interview prep with expected question list",
					"Use rejections as growth opportunities",
					"Gather information through networking"
				],
				reviews: [
					{
						id: "r1",
						rating: 5,
						comment: locale() === "ko"
							? "비전공자로서 정말 많은 도움이 되었습니다. 특히 포트폴리오 구성 부분이 좋았어요."
							: "As a non-CS major, this was incredibly helpful. The portfolio structure part was especially good.",
						date: "2024-02-15",
						helpful: 45
					},
					{
						id: "r2",
						rating: 4,
						comment: locale() === "ko"
							? "코딩테스트 준비 전략이 실용적이었습니다. 덕분에 효율적으로 준비할 수 있었어요."
							: "The coding test preparation strategy was practical. Thanks to it, I could prepare efficiently.",
						date: "2024-02-10",
						helpful: 32
					},
					{
						id: "r3",
						rating: 5,
						comment: locale() === "ko"
							? "면접 질문 리스트와 답변 예시가 정말 유용했습니다!"
							: "The interview question list and answer examples were really useful!",
						date: "2024-01-28",
						helpful: 28
					}
				]
			}
		};

		return resumes[params.id] || null;
	});

	const handlePurchase = () => {
		setShowPurchaseModal(true);
	};

	const confirmPurchase = () => {
		// Mock purchase
		setIsPurchased(true);
		setShowFullContent(true);
		setShowPurchaseModal(false);
	};

	return (
		<main class="min-h-screen bg-gradient-to-b from-gray-900 to-black">
			<div class="container mx-auto px-4 py-12">
				<Show
					when={resume()}
					fallback={
						<div class="text-center py-20">
							<h1 class="text-3xl font-bold text-white mb-4">
								{locale() === "ko" ? "레쥬메를 찾을 수 없습니다" : "Resume not found"}
							</h1>
							<A href="/resumes" class="text-violet-400 hover:text-violet-300">
								{locale() === "ko" ? "레쥬메 목록으로 돌아가기" : "Back to resumes"}
							</A>
						</div>
					}
				>
					{(currentResume) => (
						<>
							{/* Back button */}
							<div class="mb-8">
								<A
									href="/resumes"
									class="inline-flex items-center text-gray-400 hover:text-white transition-colors"
								>
									<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
									</svg>
									{locale() === "ko" ? "레쥬메 목록" : "Back to resumes"}
								</A>
							</div>

							{/* Resume Header */}
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
								<div class="flex flex-col lg:flex-row gap-8">
									<div class="flex-1">
										<div class="flex items-center gap-3 mb-4">
											<span class="px-3 py-1 bg-green-900/30 text-green-400 text-sm rounded-full border border-green-800">
												{currentResume().result}
											</span>
											<span class="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700">
												{currentResume().successDate}
											</span>
											<Show when={currentResume().anonymous}>
												<span class="px-3 py-1 bg-violet-900/30 text-violet-400 text-sm rounded-full border border-violet-800">
													{locale() === "ko" ? "익명 제공" : "Anonymous"}
												</span>
											</Show>
										</div>
										<h1 class="text-3xl font-bold text-white mb-4">{currentResume().title}</h1>
										<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
											<div>
												<p class="text-gray-400 text-sm mb-1">{locale() === "ko" ? "회사" : "Company"}</p>
												<p class="text-white font-medium">{currentResume().company}</p>
											</div>
											<div>
												<p class="text-gray-400 text-sm mb-1">{locale() === "ko" ? "직무" : "Position"}</p>
												<p class="text-white font-medium">{currentResume().position}</p>
											</div>
											<div>
												<p class="text-gray-400 text-sm mb-1">{locale() === "ko" ? "경력" : "Experience"}</p>
												<p class="text-white font-medium">{currentResume().experience}</p>
											</div>
											<div>
												<p class="text-gray-400 text-sm mb-1">{locale() === "ko" ? "연봉" : "Salary"}</p>
												<p class="text-white font-medium">{currentResume().salary}</p>
											</div>
										</div>
										<div class="flex flex-wrap gap-2">
											<For each={currentResume().tags}>
												{(tag) => (
													<span class="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700">
														{tag}
													</span>
												)}
											</For>
										</div>
									</div>

									{/* Purchase Card */}
									<div class="lg:w-80">
										<div class="bg-gray-800/50 rounded-lg p-6">
											<div class="flex items-center justify-between mb-4">
												<div>
													<p class="text-gray-400 text-sm mb-1">{locale() === "ko" ? "가격" : "Price"}</p>
													<p class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
														{currentResume().price} USDC
													</p>
												</div>
												<div class="text-right">
													<div class="flex items-center gap-1 mb-1">
														<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
															<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
														</svg>
														<span class="text-white font-medium">{currentResume().rating}</span>
													</div>
													<p class="text-gray-400 text-xs">
														{currentResume().reviewCount} {locale() === "ko" ? "개 리뷰" : "reviews"}
													</p>
												</div>
											</div>
											<div class="border-t border-gray-700 pt-4 mb-4">
												<p class="text-gray-400 text-sm mb-2">
													{locale() === "ko" ? "포함 내용" : "Includes"}
												</p>
												<ul class="space-y-2 text-sm">
													<li class="flex items-start text-gray-300">
														<svg class="w-4 h-4 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
														</svg>
														{locale() === "ko" ? "전체 이력서 원본" : "Full resume document"}
													</li>
													<li class="flex items-start text-gray-300">
														<svg class="w-4 h-4 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
														</svg>
														{locale() === "ko" ? "면접 질문 및 답변" : "Interview Q&A"}
													</li>
													<li class="flex items-start text-gray-300">
														<svg class="w-4 h-4 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
														</svg>
														{locale() === "ko" ? "준비 과정 상세" : "Preparation details"}
													</li>
													<li class="flex items-start text-gray-300">
														<svg class="w-4 h-4 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
														</svg>
														{locale() === "ko" ? "추천 자료 목록" : "Recommended resources"}
													</li>
												</ul>
											</div>
											<div class="text-center text-gray-400 text-xs mb-4">
												{currentResume().soldCount} {locale() === "ko" ? "명이 구매했습니다" : "people purchased"}
											</div>
											<Show
												when={!isPurchased()}
												fallback={
													<button
														type="button"
														class="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg cursor-default"
													>
														{locale() === "ko" ? "구매 완료" : "Purchased"} ✓
													</button>
												}
											>
												<button
													type="button"
													onClick={handlePurchase}
													class="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
												>
													{locale() === "ko" ? "구매하기" : "Purchase Now"}
												</button>
											</Show>
										</div>
									</div>
								</div>
							</div>

							{/* Preview Section */}
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
								<h2 class="text-2xl font-bold text-white mb-4">
									{locale() === "ko" ? "미리보기" : "Preview"}
								</h2>
								<p class="text-gray-400 leading-relaxed mb-6">
									{currentResume().preview}
								</p>
								<Show
									when={showFullContent()}
									fallback={
										<div class="bg-gray-800/30 rounded-lg p-8 text-center">
											<svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
											</svg>
											<p class="text-gray-400 mb-4">
												{locale() === "ko"
													? "전체 내용을 보려면 구매가 필요합니다"
													: "Purchase required to view full content"}
											</p>
											<button
												type="button"
												onClick={handlePurchase}
												class="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
											>
												{locale() === "ko" ? "지금 구매하기" : "Purchase Now"}
											</button>
										</div>
									}
								>
									<div class="space-y-6">
										<div>
											<h3 class="text-lg font-semibold text-white mb-3">
												{locale() === "ko" ? "상세 스토리" : "Full Story"}
											</h3>
											<p class="text-gray-400 leading-relaxed whitespace-pre-line">
												{currentResume().fullDescription}
											</p>
										</div>
									</div>
								</Show>
							</div>

							{/* Key Information */}
							<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
								<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
									<h3 class="text-xl font-bold text-white mb-4">
										{locale() === "ko" ? "준비 정보" : "Preparation Info"}
									</h3>
									<div class="space-y-3">
										<div class="flex justify-between">
											<span class="text-gray-400">{locale() === "ko" ? "준비 기간" : "Prep Period"}</span>
											<span class="text-white font-medium">{currentResume().preparationPeriod}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-gray-400">{locale() === "ko" ? "지원 회사" : "Applications"}</span>
											<span class="text-white font-medium">{currentResume().applicationCount}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-gray-400">{locale() === "ko" ? "면접 라운드" : "Interview Rounds"}</span>
											<span class="text-white font-medium">{currentResume().interviewRounds}</span>
										</div>
									</div>
								</div>

								<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
									<h3 class="text-xl font-bold text-white mb-4">
										{locale() === "ko" ? "핵심 전략" : "Key Strategies"}
									</h3>
									<ul class="space-y-2">
										<For each={currentResume().keyStrategies?.slice(0, showFullContent() ? undefined : 3)}>
											{(strategy) => (
												<li class="flex items-start text-gray-400">
													<span class="text-violet-400 mr-2">•</span>
													<span>{strategy}</span>
												</li>
											)}
										</For>
										<Show when={!showFullContent() && currentResume().keyStrategies && currentResume().keyStrategies.length > 3}>
											<li class="text-gray-500 italic">
												{locale() === "ko" ? "...더 보려면 구매하세요" : "...purchase to see more"}
											</li>
										</Show>
									</ul>
								</div>
							</div>

							{/* Challenges and Tips - Only shown after purchase */}
							<Show when={showFullContent()}>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
									<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
										<h3 class="text-xl font-bold text-white mb-4">
											{locale() === "ko" ? "극복한 도전과제" : "Challenges Overcome"}
										</h3>
										<ul class="space-y-2">
											<For each={currentResume().challenges}>
												{(challenge) => (
													<li class="flex items-start text-gray-400">
														<span class="text-red-400 mr-2">•</span>
														<span>{challenge}</span>
													</li>
												)}
											</For>
										</ul>
									</div>

									<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
										<h3 class="text-xl font-bold text-white mb-4">
											{locale() === "ko" ? "합격 팁" : "Success Tips"}
										</h3>
										<ul class="space-y-2">
											<For each={currentResume().tips}>
												{(tip) => (
													<li class="flex items-start text-gray-400">
														<span class="text-green-400 mr-2">•</span>
														<span>{tip}</span>
													</li>
												)}
											</For>
										</ul>
									</div>
								</div>
							</Show>

							{/* Reviews */}
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
								<h3 class="text-xl font-bold text-white mb-6">
									{locale() === "ko" ? "구매자 리뷰" : "Customer Reviews"}
								</h3>
								<div class="space-y-6">
									<For each={currentResume().reviews}>
										{(review) => (
											<div class="border-b border-gray-800 pb-6 last:border-0">
												<div class="flex items-center justify-between mb-2">
													<div class="flex items-center gap-2">
														<div class="flex">
															<For each={Array(5)}>
																{(_, i) => (
																	<svg
																		class={`w-4 h-4 ${i() < review.rating ? "text-yellow-400" : "text-gray-600"}`}
																		fill="currentColor"
																		viewBox="0 0 20 20"
																	>
																		<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																	</svg>
																)}
															</For>
														</div>
														<span class="text-gray-500 text-sm">{review.date}</span>
													</div>
													<button
														type="button"
														class="text-gray-400 hover:text-violet-400 text-sm transition-colors"
													>
														{locale() === "ko" ? `도움됨 (${review.helpful})` : `Helpful (${review.helpful})`}
													</button>
												</div>
												<p class="text-gray-400">{review.comment}</p>
											</div>
										)}
									</For>
								</div>
							</div>

							{/* Purchase Modal */}
							<Show when={showPurchaseModal()}>
								<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
									<div class="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full">
										<h3 class="text-xl font-bold text-white mb-4">
											{locale() === "ko" ? "레쥬메 구매 확인" : "Confirm Purchase"}
										</h3>
										<div class="bg-gray-800 rounded-lg p-4 mb-4">
											<p class="text-white font-medium mb-2">{currentResume().title}</p>
											<p class="text-gray-400 text-sm">{currentResume().company} • {currentResume().position}</p>
										</div>
										<div class="flex items-center justify-between mb-6">
											<span class="text-gray-400">{locale() === "ko" ? "결제 금액" : "Payment Amount"}</span>
											<span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
												{currentResume().price} USDC
											</span>
										</div>
										<p class="text-gray-400 text-sm mb-6">
											{locale() === "ko"
												? "구매 후 즉시 전체 내용을 열람할 수 있습니다. 환불은 불가능하니 신중히 결정해주세요."
												: "You can view the full content immediately after purchase. Please decide carefully as refunds are not available."}
										</p>
										<div class="flex gap-2">
											<button
												type="button"
												onClick={confirmPurchase}
												class="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
											>
												{locale() === "ko" ? "구매 확인" : "Confirm Purchase"}
											</button>
											<button
												type="button"
												onClick={() => setShowPurchaseModal(false)}
												class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
											>
												{locale() === "ko" ? "취소" : "Cancel"}
											</button>
										</div>
									</div>
								</div>
							</Show>
						</>
					)}
				</Show>
			</div>
		</main>
	);
}