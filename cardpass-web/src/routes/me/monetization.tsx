import { createSignal, Show, For, onMount } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { useI18n } from "~/contexts/i18n";
import { useWallet } from "~/store/wallet";

interface Resume {
	id: string;
	title: string;
	company: string;
	position: string;
	uploadedAt: string;
	status: "draft" | "review" | "published" | "rejected";
	price: number;
	soldCount: number;
	earnings: number;
	rating?: number;
	reviewCount?: number;
}

interface SalesData {
	totalSales: number;
	totalEarnings: number;
	monthlyEarnings: number;
	averageRating: number;
	topSellingResume: string;
}

export default function Monetization() {
	const { t, locale } = useI18n();
	const navigate = useNavigate();
	const { connected } = useWallet();

	// Check authentication on mount
	onMount(() => {
		if (!connected()) {
			navigate("/", { replace: true });
		}
	});

	const [activeTab, setActiveTab] = createSignal<"upload" | "manage" | "earnings">("upload");
	const [showUploadModal, setShowUploadModal] = createSignal(false);
	const [showAnonymizeModal, setShowAnonymizeModal] = createSignal(false);
	const [selectedResume, setSelectedResume] = createSignal<Resume | null>(null);

	// Form state for new resume
	const [resumeForm, setResumeForm] = createSignal({
		title: "",
		company: "",
		position: "",
		salary: "",
		experience: "",
		industry: "",
		preparationPeriod: "",
		applicationCount: "",
		interviewRounds: "",
		description: "",
		keyStrategies: "",
		challenges: "",
		tips: "",
		price: 20,
	});

	// Mock data
	const myResumes = (): Resume[] => [
		{
			id: "1",
			title: locale() === "ko"
				? "비전공자에서 네이버 프론트엔드 개발자까지"
				: "From Non-CS to Naver Frontend Developer",
			company: locale() === "ko" ? "네이버" : "Naver",
			position: locale() === "ko" ? "프론트엔드 개발자" : "Frontend Developer",
			uploadedAt: "2024-01-15",
			status: "published",
			price: 15,
			soldCount: 234,
			earnings: 3510,
			rating: 4.8,
			reviewCount: 89,
		},
		{
			id: "2",
			title: locale() === "ko"
				? "스타트업에서 대기업 전직 성공기"
				: "Successful Career Change from Startup to Corporation",
			company: locale() === "ko" ? "삼성전자" : "Samsung Electronics",
			position: locale() === "ko" ? "소프트웨어 엔지니어" : "Software Engineer",
			uploadedAt: "2024-02-01",
			status: "review",
			price: 25,
			soldCount: 0,
			earnings: 0,
		},
		{
			id: "3",
			title: locale() === "ko"
				? "3년차 개발자의 연봉 협상 노하우"
				: "Salary Negotiation Tips for 3-Year Developer",
			company: locale() === "ko" ? "카카오" : "Kakao",
			position: locale() === "ko" ? "백엔드 개발자" : "Backend Developer",
			uploadedAt: "2023-12-20",
			status: "published",
			price: 10,
			soldCount: 156,
			earnings: 1560,
			rating: 4.6,
			reviewCount: 45,
		},
		{
			id: "4",
			title: locale() === "ko"
				? "첫 해외 취업 성공 가이드"
				: "Guide to First Overseas Job Success",
			company: "Google",
			position: locale() === "ko" ? "데이터 엔지니어" : "Data Engineer",
			uploadedAt: "2024-02-10",
			status: "draft",
			price: 30,
			soldCount: 0,
			earnings: 0,
		},
	];

	const salesData = (): SalesData => ({
		totalSales: 390,
		totalEarnings: 5070,
		monthlyEarnings: 1250,
		averageRating: 4.7,
		topSellingResume: locale() === "ko"
			? "비전공자에서 네이버 프론트엔드 개발자까지"
			: "From Non-CS to Naver Frontend Developer",
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "published":
				return "text-green-400 bg-green-900/30 border-green-800";
			case "review":
				return "text-yellow-400 bg-yellow-900/30 border-yellow-800";
			case "draft":
				return "text-gray-400 bg-gray-900/30 border-gray-800";
			case "rejected":
				return "text-red-400 bg-red-900/30 border-red-800";
			default:
				return "text-gray-400 bg-gray-900/30 border-gray-800";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "published":
				return locale() === "ko" ? "판매중" : "Published";
			case "review":
				return locale() === "ko" ? "검토중" : "Under Review";
			case "draft":
				return locale() === "ko" ? "임시저장" : "Draft";
			case "rejected":
				return locale() === "ko" ? "거절됨" : "Rejected";
			default:
				return status;
		}
	};

	const handleResumeSubmit = () => {
		console.log("Submitting resume:", resumeForm());
		setShowUploadModal(false);
		// Reset form
		setResumeForm({
			title: "",
			company: "",
			position: "",
			salary: "",
			experience: "",
			industry: "",
			preparationPeriod: "",
			applicationCount: "",
			interviewRounds: "",
			description: "",
			keyStrategies: "",
			challenges: "",
			tips: "",
			price: 20,
		});
	};

	const handleAnonymize = (resume: Resume) => {
		setSelectedResume(resume);
		setShowAnonymizeModal(true);
	};

	return (
		<Show
			when={connected()}
			fallback={
				<main class="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
					<div class="text-center">
						<h1 class="text-3xl font-bold text-white mb-4">
							{locale() === "ko" ? "로그인이 필요합니다" : "Login Required"}
						</h1>
						<p class="text-gray-400 mb-8">
							{locale() === "ko"
								? "레쥬메 수익화를 이용하려면 지갑을 연결해주세요"
								: "Please connect your wallet to access monetization"}
						</p>
						<A
							href="/"
							class="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
						>
							{locale() === "ko" ? "홈으로 돌아가기" : "Back to Home"}
						</A>
					</div>
				</main>
			}
		>
			<main class="min-h-screen bg-gradient-to-b from-gray-900 to-black">
				<div class="container mx-auto px-4 py-12">
					{/* Header */}
					<div class="mb-8">
						<h1 class="text-4xl font-bold text-white mb-2">
							{locale() === "ko" ? "레쥬메 수익화" : "Resume Monetization"}
						</h1>
						<p class="text-gray-400">
							{locale() === "ko"
								? "합격한 이력서를 익명으로 판매하고 수익을 창출하세요"
								: "Sell your successful resumes anonymously and generate income"}
						</p>
					</div>

					{/* Stats Cards */}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<p class="text-gray-400 text-sm mb-2">{locale() === "ko" ? "총 판매" : "Total Sales"}</p>
							<p class="text-3xl font-bold text-white">{salesData().totalSales}</p>
						</div>
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<p class="text-gray-400 text-sm mb-2">{locale() === "ko" ? "총 수익" : "Total Earnings"}</p>
							<p class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
								{salesData().totalEarnings} USDC
							</p>
						</div>
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<p class="text-gray-400 text-sm mb-2">{locale() === "ko" ? "월 수익" : "Monthly"}</p>
							<p class="text-3xl font-bold text-white">{salesData().monthlyEarnings} USDC</p>
						</div>
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<p class="text-gray-400 text-sm mb-2">{locale() === "ko" ? "평균 평점" : "Avg Rating"}</p>
							<p class="text-3xl font-bold text-white">⭐ {salesData().averageRating}</p>
						</div>
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<p class="text-gray-400 text-sm mb-2">{locale() === "ko" ? "베스트셀러" : "Best Seller"}</p>
							<p class="text-sm text-white truncate">{salesData().topSellingResume}</p>
						</div>
					</div>

					{/* Tabs */}
					<div class="flex gap-2 mb-8">
						<button
							type="button"
							onClick={() => setActiveTab("upload")}
							class={`px-4 py-2 rounded-lg font-medium transition-all ${
								activeTab() === "upload"
									? "bg-violet-600/20 text-violet-400"
									: "bg-gray-800 text-gray-400 hover:text-white"
							}`}
						>
							{locale() === "ko" ? "새 레쥬메 등록" : "Upload Resume"}
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("manage")}
							class={`px-4 py-2 rounded-lg font-medium transition-all ${
								activeTab() === "manage"
									? "bg-violet-600/20 text-violet-400"
									: "bg-gray-800 text-gray-400 hover:text-white"
							}`}
						>
							{locale() === "ko" ? "내 레쥬메 관리" : "Manage Resumes"}
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("earnings")}
							class={`px-4 py-2 rounded-lg font-medium transition-all ${
								activeTab() === "earnings"
									? "bg-violet-600/20 text-violet-400"
									: "bg-gray-800 text-gray-400 hover:text-white"
							}`}
						>
							{locale() === "ko" ? "수익 분석" : "Earnings Analysis"}
						</button>
					</div>

					{/* Tab Content */}
					<Show when={activeTab() === "upload"}>
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
							<h2 class="text-2xl font-bold text-white mb-6">
								{locale() === "ko" ? "새 레쥬메 등록" : "Upload New Resume"}
							</h2>

							<div class="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 rounded-lg p-6 mb-8">
								<h3 class="text-lg font-semibold text-white mb-3">
									{locale() === "ko" ? "📝 등록 가이드" : "📝 Upload Guide"}
								</h3>
								<ul class="space-y-2 text-gray-300">
									<li class="flex items-start">
										<span class="text-violet-400 mr-2">1.</span>
										{locale() === "ko"
											? "실제 합격한 이력서만 등록 가능합니다"
											: "Only successful resumes can be uploaded"}
									</li>
									<li class="flex items-start">
										<span class="text-violet-400 mr-2">2.</span>
										{locale() === "ko"
											? "개인정보는 자동으로 익명화 처리됩니다"
											: "Personal information will be automatically anonymized"}
									</li>
									<li class="flex items-start">
										<span class="text-violet-400 mr-2">3.</span>
										{locale() === "ko"
											? "검토 후 24시간 이내 승인/거절이 결정됩니다"
											: "Review results will be provided within 24 hours"}
									</li>
									<li class="flex items-start">
										<span class="text-violet-400 mr-2">4.</span>
										{locale() === "ko"
											? "판매 수익의 85%를 받으실 수 있습니다"
											: "You'll receive 85% of sales revenue"}
									</li>
								</ul>
							</div>

							<button
								type="button"
								onClick={() => setShowUploadModal(true)}
								class="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 transition-all flex flex-col items-center justify-center gap-2"
							>
								<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
								</svg>
								<span class="text-gray-300 font-medium">
									{locale() === "ko" ? "클릭하여 레쥬메 등록 시작" : "Click to start uploading resume"}
								</span>
								<span class="text-gray-500 text-sm">
									{locale() === "ko" ? "또는 파일을 여기에 드래그" : "Or drag and drop your file here"}
								</span>
							</button>
						</div>
					</Show>

					<Show when={activeTab() === "manage"}>
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
							<h2 class="text-2xl font-bold text-white mb-6">
								{locale() === "ko" ? "내 레쥬메 관리" : "Manage My Resumes"}
							</h2>

							<div class="overflow-x-auto">
								<table class="w-full">
									<thead>
										<tr class="border-b border-gray-800">
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "제목" : "Title"}
											</th>
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "회사/직무" : "Company/Position"}
											</th>
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "상태" : "Status"}
											</th>
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "가격" : "Price"}
											</th>
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "판매" : "Sales"}
											</th>
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "수익" : "Earnings"}
											</th>
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "평점" : "Rating"}
											</th>
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "작업" : "Actions"}
											</th>
										</tr>
									</thead>
									<tbody>
										<For each={myResumes()}>
											{(resume) => (
												<tr class="border-b border-gray-800/50 hover:bg-gray-800/30">
													<td class="py-3 px-4">
														<p class="text-white font-medium truncate max-w-xs">{resume.title}</p>
														<p class="text-gray-500 text-sm">{resume.uploadedAt}</p>
													</td>
													<td class="py-3 px-4">
														<p class="text-gray-300">{resume.company}</p>
														<p class="text-gray-500 text-sm">{resume.position}</p>
													</td>
													<td class="py-3 px-4">
														<span class={`px-2 py-1 text-xs rounded-full border ${getStatusColor(resume.status)}`}>
															{getStatusText(resume.status)}
														</span>
													</td>
													<td class="py-3 px-4 text-gray-300">{resume.price} USDC</td>
													<td class="py-3 px-4 text-gray-300">{resume.soldCount}</td>
													<td class="py-3 px-4 text-violet-400 font-medium">{resume.earnings} USDC</td>
													<td class="py-3 px-4">
														<Show
															when={resume.rating}
															fallback={<span class="text-gray-500">-</span>}
														>
															<div class="flex items-center gap-1">
																<span class="text-yellow-400">⭐</span>
																<span class="text-gray-300">{resume.rating}</span>
																<span class="text-gray-500 text-xs">({resume.reviewCount})</span>
															</div>
														</Show>
													</td>
													<td class="py-3 px-4">
														<div class="flex gap-2">
															<Show when={resume.status === "draft"}>
																<button
																	type="button"
																	class="text-violet-400 hover:text-violet-300 text-sm"
																>
																	{locale() === "ko" ? "편집" : "Edit"}
																</button>
															</Show>
															<Show when={resume.status === "published"}>
																<button
																	type="button"
																	onClick={() => handleAnonymize(resume)}
																	class="text-cyan-400 hover:text-cyan-300 text-sm"
																>
																	{locale() === "ko" ? "통계" : "Stats"}
																</button>
															</Show>
															<button
																type="button"
																class="text-gray-400 hover:text-gray-300 text-sm"
															>
																{locale() === "ko" ? "삭제" : "Delete"}
															</button>
														</div>
													</td>
												</tr>
											)}
										</For>
									</tbody>
								</table>
							</div>
						</div>
					</Show>

					<Show when={activeTab() === "earnings"}>
						<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Earnings Chart */}
							<div class="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
								<h2 class="text-2xl font-bold text-white mb-6">
									{locale() === "ko" ? "수익 추이" : "Earnings Trend"}
								</h2>

								{/* Mock Chart */}
								<div class="h-64 flex items-end justify-between gap-2">
									{[40, 65, 45, 80, 95, 70, 85, 110, 90, 125, 100, 130].map((height) => (
										<div class="flex-1 bg-gradient-to-t from-violet-600 to-cyan-600 rounded-t" style={`height: ${height}%`}></div>
									))}
								</div>
								<div class="flex justify-between mt-2 text-xs text-gray-500">
									<span>Jan</span>
									<span>Feb</span>
									<span>Mar</span>
									<span>Apr</span>
									<span>May</span>
									<span>Jun</span>
									<span>Jul</span>
									<span>Aug</span>
									<span>Sep</span>
									<span>Oct</span>
									<span>Nov</span>
									<span>Dec</span>
								</div>
							</div>

							{/* Top Performers */}
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
								<h3 class="text-xl font-bold text-white mb-4">
									{locale() === "ko" ? "베스트 레쥬메" : "Top Performers"}
								</h3>
								<div class="space-y-4">
									<For each={myResumes().filter(r => r.status === "published").slice(0, 3)}>
										{(resume) => (
											<div class="pb-4 border-b border-gray-800 last:border-0">
												<p class="text-white font-medium text-sm truncate">{resume.title}</p>
												<div class="flex justify-between mt-2">
													<span class="text-gray-400 text-sm">
														{resume.soldCount} {locale() === "ko" ? "판매" : "sales"}
													</span>
													<span class="text-violet-400 font-medium">
														{resume.earnings} USDC
													</span>
												</div>
											</div>
										)}
									</For>
								</div>
							</div>
						</div>

						{/* Withdrawal Section */}
						<div class="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
							<h3 class="text-xl font-bold text-white mb-4">
								{locale() === "ko" ? "수익 출금" : "Withdraw Earnings"}
							</h3>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div class="bg-gray-800 rounded-lg p-4">
									<p class="text-gray-400 text-sm mb-1">
										{locale() === "ko" ? "출금 가능 잔액" : "Available Balance"}
									</p>
									<p class="text-2xl font-bold text-white">{salesData().totalEarnings} USDC</p>
								</div>
								<div class="bg-gray-800 rounded-lg p-4">
									<p class="text-gray-400 text-sm mb-1">
										{locale() === "ko" ? "대기중 수익" : "Pending Earnings"}
									</p>
									<p class="text-2xl font-bold text-gray-300">125 USDC</p>
								</div>
								<div class="flex items-center">
									<button
										type="button"
										class="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
									>
										{locale() === "ko" ? "출금 요청" : "Request Withdrawal"}
									</button>
								</div>
							</div>
						</div>
					</Show>

					{/* Upload Modal */}
					<Show when={showUploadModal()}>
						<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
							<div class="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
								<h3 class="text-xl font-bold text-white mb-4">
									{locale() === "ko" ? "레쥬메 정보 입력" : "Enter Resume Information"}
								</h3>

								<div class="space-y-4">
									<div>
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "제목" : "Title"}
										</label>
										<input
											type="text"
											value={resumeForm().title}
											onInput={(e) => setResumeForm(prev => ({ ...prev, title: e.currentTarget.value }))}
											placeholder={locale() === "ko"
												? "예: 비전공자에서 네이버 개발자까지"
												: "e.g., From Non-CS to Naver Developer"}
											class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
										/>
									</div>

									<div class="grid grid-cols-2 gap-4">
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "회사" : "Company"}
											</label>
											<input
												type="text"
												value={resumeForm().company}
												onInput={(e) => setResumeForm(prev => ({ ...prev, company: e.currentTarget.value }))}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "직무" : "Position"}
											</label>
											<input
												type="text"
												value={resumeForm().position}
												onInput={(e) => setResumeForm(prev => ({ ...prev, position: e.currentTarget.value }))}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
									</div>

									<div class="grid grid-cols-2 gap-4">
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "연봉" : "Salary"}
											</label>
											<input
												type="text"
												value={resumeForm().salary}
												onInput={(e) => setResumeForm(prev => ({ ...prev, salary: e.currentTarget.value }))}
												placeholder={locale() === "ko" ? "예: 5,000만원" : "e.g., $50,000"}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "경력" : "Experience"}
											</label>
											<input
												type="text"
												value={resumeForm().experience}
												onInput={(e) => setResumeForm(prev => ({ ...prev, experience: e.currentTarget.value }))}
												placeholder={locale() === "ko" ? "예: 신입, 3년차" : "e.g., Entry, 3 years"}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
									</div>

									<div>
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "합격 스토리" : "Success Story"}
										</label>
										<textarea
											value={resumeForm().description}
											onInput={(e) => setResumeForm(prev => ({ ...prev, description: e.currentTarget.value }))}
											rows="4"
											placeholder={locale() === "ko"
												? "어떻게 준비하고 합격했는지 자세히 작성해주세요..."
												: "Describe how you prepared and succeeded in detail..."}
											class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
										/>
									</div>

									<div>
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "판매 가격 (USDC)" : "Sales Price (USDC)"}
										</label>
										<input
											type="number"
											value={resumeForm().price}
											onInput={(e) => setResumeForm(prev => ({ ...prev, price: parseInt(e.currentTarget.value) || 0 }))}
											min="5"
											max="100"
											class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
										/>
										<p class="text-gray-500 text-xs mt-1">
											{locale() === "ko"
												? "추천 가격: 15-30 USDC (수수료 15% 제외)"
												: "Recommended: 15-30 USDC (15% platform fee applies)"}
										</p>
									</div>
								</div>

								<div class="flex gap-2 mt-6">
									<button
										type="button"
										onClick={handleResumeSubmit}
										class="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
									>
										{locale() === "ko" ? "등록하기" : "Submit"}
									</button>
									<button
										type="button"
										onClick={() => setShowUploadModal(false)}
										class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
									>
										{locale() === "ko" ? "취소" : "Cancel"}
									</button>
								</div>
							</div>
						</div>
					</Show>
				</div>
			</main>
		</Show>
	);
}