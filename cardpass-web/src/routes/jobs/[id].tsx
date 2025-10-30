import { useParams, A } from "@solidjs/router";
import { createMemo, createSignal, Show } from "solid-js";
import { useI18n } from "~/contexts/i18n";

interface Job {
	id: string;
	title: string;
	company: string;
	location: string;
	type: string;
	bounty: number;
	posted: string;
	description: string;
	tags: string[];
	requirements?: string[];
	responsibilities?: string[];
	benefits?: string[];
	companyDescription?: string;
	applicationDeadline?: string;
	experienceLevel?: string;
	salary?: string;
}

export default function JobDetail() {
	const { t, locale } = useI18n();
	const params = useParams();
	const [showShareModal, setShowShareModal] = createSignal(false);
	const [referralLink, setReferralLink] = createSignal("");
	const [copied, setCopied] = createSignal(false);

	const job = createMemo(() => {
		const jobList = t("jobs.jobList") as unknown as Job[];
		const foundJob = jobList?.find((j) => j.id === params.id);

		if (!foundJob) return null;

		// Add mock additional details for now
		return {
			...foundJob,
			requirements: [
				locale() === "ko" ? "5년 이상의 개발 경험" : "5+ years of development experience",
				locale() === "ko" ? "React/Vue/Solid 등 프레임워크 경험" : "Experience with React/Vue/Solid frameworks",
				locale() === "ko" ? "블록체인 기술에 대한 이해" : "Understanding of blockchain technology",
				locale() === "ko" ? "영어 커뮤니케이션 가능" : "English communication skills",
			],
			responsibilities: [
				locale() === "ko" ? "프론트엔드 아키텍처 설계 및 구현" : "Design and implement frontend architecture",
				locale() === "ko" ? "주니어 개발자 멘토링" : "Mentor junior developers",
				locale() === "ko" ? "코드 리뷰 및 품질 관리" : "Code review and quality management",
				locale() === "ko" ? "크로스 펑셔널 팀과의 협업" : "Collaborate with cross-functional teams",
			],
			benefits: [
				locale() === "ko" ? "유연한 근무 시간" : "Flexible working hours",
				locale() === "ko" ? "원격 근무 가능" : "Remote work available",
				locale() === "ko" ? "스톡옵션 제공" : "Stock options",
				locale() === "ko" ? "교육비 지원" : "Education stipend",
			],
			companyDescription: locale() === "ko"
				? "혁신적인 블록체인 기술로 금융의 미래를 만들어가는 스타트업입니다."
				: "A startup creating the future of finance with innovative blockchain technology.",
			applicationDeadline: "2024-12-31",
			experienceLevel: locale() === "ko" ? "시니어" : "Senior",
			salary: locale() === "ko" ? "협의 가능" : "Negotiable",
		};
	});

	const handleCreateReferral = () => {
		// Generate a mock referral link
		const baseUrl = window.location.origin;
		const referralId = Math.random().toString(36).substring(7);
		const link = `${baseUrl}/jobs/${params.id}?ref=${referralId}`;
		setReferralLink(link);
		setShowShareModal(true);
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(referralLink());
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<main class="min-h-screen bg-gradient-to-b from-gray-900 to-black">
			<div class="container mx-auto px-4 py-12">
				<Show
					when={job()}
					fallback={
						<div class="text-center py-20">
							<h1 class="text-3xl font-bold text-white mb-4">
								{locale() === "ko" ? "채용 공고를 찾을 수 없습니다" : "Job not found"}
							</h1>
							<A href="/jobs" class="text-violet-400 hover:text-violet-300">
								{locale() === "ko" ? "채용 공고 목록으로 돌아가기" : "Back to job listings"}
							</A>
						</div>
					}
				>
					{(currentJob) => (
						<>
							{/* Back button */}
							<div class="mb-8">
								<A
									href="/jobs"
									class="inline-flex items-center text-gray-400 hover:text-white transition-colors"
								>
									<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
									</svg>
									{locale() === "ko" ? "채용 공고 목록" : "Back to jobs"}
								</A>
							</div>

							{/* Job Header */}
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
								<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
									<div class="flex-1">
										<h1 class="text-4xl font-bold text-white mb-4">{currentJob().title}</h1>
										<div class="flex flex-wrap items-center gap-3 text-gray-400">
											<span class="text-lg font-medium text-gray-300">{currentJob().company}</span>
											<span>•</span>
											<span>{currentJob().location}</span>
											<span>•</span>
											<span>{currentJob().type}</span>
											<span>•</span>
											<span>{currentJob().experienceLevel}</span>
										</div>
										<div class="flex flex-wrap gap-2 mt-4">
											{currentJob().tags.map((tag) => (
												<span class="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700">
													{tag}
												</span>
											))}
										</div>
									</div>

									<div class="flex flex-col items-end gap-4">
										<div class="text-right">
											<p class="text-sm text-gray-400 mb-1">{t("jobs.bountyLabel")}</p>
											<p class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
												{currentJob().bounty} USDC
											</p>
										</div>
										<div class="text-right">
											<p class="text-sm text-gray-400">
												{locale() === "ko" ? "급여" : "Salary"}: {currentJob().salary}
											</p>
											<p class="text-sm text-gray-400">
												{locale() === "ko" ? "마감일" : "Deadline"}: {currentJob().applicationDeadline}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div class="flex flex-col sm:flex-row gap-4 mb-8">
								<button
									type="button"
									class="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all text-lg"
								>
									{t("jobs.applyButton")}
								</button>
								<button
									type="button"
									onClick={handleCreateReferral}
									class="flex-1 px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors text-lg border border-gray-700"
								>
									{t("jobs.createReferralButton")}
								</button>
							</div>

							{/* Company Description */}
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
								<h2 class="text-2xl font-bold text-white mb-4">
									{locale() === "ko" ? "회사 소개" : "About the Company"}
								</h2>
								<p class="text-gray-400 leading-relaxed">{currentJob().companyDescription}</p>
							</div>

							{/* Job Description */}
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
								<h2 class="text-2xl font-bold text-white mb-4">
									{locale() === "ko" ? "업무 소개" : "Job Description"}
								</h2>
								<p class="text-gray-400 leading-relaxed">{currentJob().description}</p>
							</div>

							{/* Responsibilities */}
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
								<h2 class="text-2xl font-bold text-white mb-4">
									{locale() === "ko" ? "주요 업무" : "Key Responsibilities"}
								</h2>
								<ul class="space-y-2">
									{currentJob().responsibilities?.map((item) => (
										<li class="flex items-start text-gray-400">
											<span class="text-violet-400 mr-3 mt-1">•</span>
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Requirements */}
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
								<h2 class="text-2xl font-bold text-white mb-4">
									{locale() === "ko" ? "자격 요건" : "Requirements"}
								</h2>
								<ul class="space-y-2">
									{currentJob().requirements?.map((item) => (
										<li class="flex items-start text-gray-400">
											<span class="text-violet-400 mr-3 mt-1">•</span>
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Benefits */}
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
								<h2 class="text-2xl font-bold text-white mb-4">
									{locale() === "ko" ? "복리후생" : "Benefits"}
								</h2>
								<ul class="space-y-2">
									{currentJob().benefits?.map((item) => (
										<li class="flex items-start text-gray-400">
											<span class="text-violet-400 mr-3 mt-1">•</span>
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Bottom Action Buttons */}
							<div class="flex flex-col sm:flex-row gap-4">
								<button
									type="button"
									class="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all text-lg"
								>
									{t("jobs.applyButton")}
								</button>
								<button
									type="button"
									onClick={handleCreateReferral}
									class="flex-1 px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors text-lg border border-gray-700"
								>
									{t("jobs.createReferralButton")}
								</button>
							</div>

							{/* Share Modal */}
							<Show when={showShareModal()}>
								<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
									<div class="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full">
										<h3 class="text-xl font-bold text-white mb-4">
											{locale() === "ko" ? "소개 링크가 생성되었습니다!" : "Referral Link Created!"}
										</h3>
										<p class="text-gray-400 mb-4">
											{locale() === "ko"
												? "아래 링크를 통해 지원하면 채용 성공 시 보상을 받을 수 있습니다."
												: "Share this link to earn rewards when someone gets hired through your referral."}
										</p>
										<div class="bg-gray-800 rounded-lg p-3 mb-4 break-all">
											<code class="text-sm text-gray-300">{referralLink()}</code>
										</div>
										<div class="flex gap-2">
											<button
												type="button"
												onClick={copyToClipboard}
												class="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
											>
												{copied()
													? (locale() === "ko" ? "복사됨!" : "Copied!")
													: (locale() === "ko" ? "링크 복사" : "Copy Link")}
											</button>
											<button
												type="button"
												onClick={() => setShowShareModal(false)}
												class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
											>
												{locale() === "ko" ? "닫기" : "Close"}
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