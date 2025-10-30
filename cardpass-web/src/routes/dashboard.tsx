import { createSignal, Show, For, onMount } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { useI18n } from "~/contexts/i18n";
import { useWallet } from "~/store/wallet";

interface ContactRequest {
	id: string;
	from: string;
	fromName: string;
	amount: number;
	message: string;
	timestamp: string;
	status: "pending" | "accepted" | "rejected";
}

interface JobApplication {
	id: string;
	jobTitle: string;
	company: string;
	appliedAt: string;
	status: "review" | "interview" | "rejected" | "accepted";
	referredBy?: string;
}

interface Referral {
	id: string;
	candidateName: string;
	jobTitle: string;
	company: string;
	referredAt: string;
	status: "pending" | "interview" | "hired" | "rejected";
	potentialReward: number;
}

interface Activity {
	id: string;
	type: "contact" | "application" | "referral" | "purchase" | "sale";
	description: string;
	timestamp: string;
	amount?: number;
}

export default function Dashboard() {
	const { t, locale } = useI18n();
	const navigate = useNavigate();
	const { connected, publicKey } = useWallet();
	const [activeTab, setActiveTab] = createSignal<"overview" | "contacts" | "applications" | "referrals" | "earnings">("overview");

	// Check authentication on mount
	onMount(() => {
		if (!connected()) {
			navigate("/", { replace: true });
		}
	});

	// Mock data
	const stats = () => ({
		totalEarnings: 342,
		monthlyEarnings: 125,
		pendingContacts: 3,
		activeApplications: 2,
		successfulReferrals: 5,
		profileViews: 1234,
		responseRate: 92,
		resumeSales: 12,
	});

	const contactRequests = (): ContactRequest[] => [
		{
			id: "1",
			from: "0x1234...5678",
			fromName: locale() === "ko" ? "김리크루터" : "Recruiter Kim",
			amount: 50,
			message: locale() === "ko"
				? "안녕하세요! React 개발자를 찾고 있습니다. 연락 가능하신가요?"
				: "Hello! Looking for React developers. Are you available to chat?",
			timestamp: "2024-03-01 14:30",
			status: "pending",
		},
		{
			id: "2",
			from: "0x8765...4321",
			fromName: locale() === "ko" ? "박매니저" : "Manager Park",
			amount: 30,
			message: locale() === "ko"
				? "블록체인 프로젝트 협업 제안드립니다."
				: "Would like to discuss a blockchain project collaboration.",
			timestamp: "2024-02-28 10:15",
			status: "pending",
		},
		{
			id: "3",
			from: "0x2468...1357",
			fromName: locale() === "ko" ? "이대표" : "CEO Lee",
			amount: 100,
			message: locale() === "ko"
				? "시니어 개발자 포지션 제안"
				: "Senior developer position offer",
			timestamp: "2024-02-27 16:45",
			status: "accepted",
		},
	];

	const applications = (): JobApplication[] => [
		{
			id: "1",
			jobTitle: locale() === "ko" ? "시니어 프론트엔드 개발자" : "Senior Frontend Developer",
			company: locale() === "ko" ? "네이버" : "Naver",
			appliedAt: "2024-02-25",
			status: "interview",
		},
		{
			id: "2",
			jobTitle: locale() === "ko" ? "블록체인 개발자" : "Blockchain Developer",
			company: locale() === "ko" ? "업비트" : "Upbit",
			appliedAt: "2024-02-20",
			status: "review",
			referredBy: locale() === "ko" ? "김알렉스" : "Alex Kim",
		},
	];

	const referrals = (): Referral[] => [
		{
			id: "1",
			candidateName: locale() === "ko" ? "박개발자" : "Developer Park",
			jobTitle: locale() === "ko" ? "백엔드 개발자" : "Backend Developer",
			company: locale() === "ko" ? "카카오" : "Kakao",
			referredAt: "2024-02-22",
			status: "interview",
			potentialReward: 500,
		},
		{
			id: "2",
			candidateName: locale() === "ko" ? "최디자이너" : "Designer Choi",
			jobTitle: locale() === "ko" ? "UX 디자이너" : "UX Designer",
			company: locale() === "ko" ? "토스" : "Toss",
			referredAt: "2024-02-15",
			status: "hired",
			potentialReward: 300,
		},
	];

	const recentActivity = (): Activity[] => [
		{
			id: "1",
			type: "contact",
			description: locale() === "ko"
				? "김리크루터님으로부터 연락 요청을 받았습니다"
				: "Received contact request from Recruiter Kim",
			timestamp: "2024-03-01 14:30",
			amount: 50,
		},
		{
			id: "2",
			type: "sale",
			description: locale() === "ko"
				? "레쥬메가 판매되었습니다"
				: "Your resume was sold",
			timestamp: "2024-03-01 12:00",
			amount: 15,
		},
		{
			id: "3",
			type: "referral",
			description: locale() === "ko"
				? "최디자이너님이 토스에 합격했습니다!"
				: "Designer Choi got hired at Toss!",
			timestamp: "2024-02-28 18:00",
			amount: 300,
		},
		{
			id: "4",
			type: "application",
			description: locale() === "ko"
				? "네이버 면접 일정이 확정되었습니다"
				: "Naver interview scheduled",
			timestamp: "2024-02-27 09:00",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "pending":
			case "review":
				return "text-yellow-400 bg-yellow-900/30 border-yellow-800";
			case "accepted":
			case "hired":
			case "interview":
				return "text-green-400 bg-green-900/30 border-green-800";
			case "rejected":
				return "text-red-400 bg-red-900/30 border-red-800";
			default:
				return "text-gray-400 bg-gray-900/30 border-gray-800";
		}
	};

	const getActivityIcon = (type: string) => {
		switch (type) {
			case "contact":
				return "📬";
			case "application":
				return "📝";
			case "referral":
				return "🤝";
			case "purchase":
				return "🛍️";
			case "sale":
				return "💰";
			default:
				return "📌";
		}
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
								? "대시보드를 이용하려면 지갑을 연결해주세요"
								: "Please connect your wallet to access the dashboard"}
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
							{locale() === "ko" ? "대시보드" : "Dashboard"}
						</h1>
						<p class="text-gray-400">
							{locale() === "ko"
								? `환영합니다, ${publicKey()?.toString().slice(0, 4)}...${publicKey()?.toString().slice(-4)}님`
								: `Welcome back, ${publicKey()?.toString().slice(0, 4)}...${publicKey()?.toString().slice(-4)}`}
						</p>
					</div>

					{/* Quick Stats */}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<div class="flex items-center justify-between mb-2">
								<p class="text-gray-400 text-sm">{locale() === "ko" ? "총 수익" : "Total Earnings"}</p>
								<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<p class="text-3xl font-bold text-white mb-1">{stats().totalEarnings} USDC</p>
							<p class="text-xs text-green-400">+{stats().monthlyEarnings} {locale() === "ko" ? "이번 달" : "this month"}</p>
						</div>

						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<div class="flex items-center justify-between mb-2">
								<p class="text-gray-400 text-sm">{locale() === "ko" ? "대기중 연락" : "Pending Contacts"}</p>
								<svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
								</svg>
							</div>
							<p class="text-3xl font-bold text-white mb-1">{stats().pendingContacts}</p>
							<p class="text-xs text-gray-400">{locale() === "ko" ? "응답 대기중" : "Awaiting response"}</p>
						</div>

						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<div class="flex items-center justify-between mb-2">
								<p class="text-gray-400 text-sm">{locale() === "ko" ? "진행중 지원" : "Active Applications"}</p>
								<svg class="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<p class="text-3xl font-bold text-white mb-1">{stats().activeApplications}</p>
							<p class="text-xs text-gray-400">{locale() === "ko" ? "면접 진행중" : "In progress"}</p>
						</div>

						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<div class="flex items-center justify-between mb-2">
								<p class="text-gray-400 text-sm">{locale() === "ko" ? "성공 추천" : "Successful Referrals"}</p>
								<svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</div>
							<p class="text-3xl font-bold text-white mb-1">{stats().successfulReferrals}</p>
							<p class="text-xs text-gray-400">{locale() === "ko" ? "채용 성공" : "Hired"}</p>
						</div>
					</div>

					{/* Tabs */}
					<div class="flex gap-2 mb-8 overflow-x-auto">
						<button
							type="button"
							onClick={() => setActiveTab("overview")}
							class={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
								activeTab() === "overview"
									? "bg-violet-600/20 text-violet-400"
									: "bg-gray-800 text-gray-400 hover:text-white"
							}`}
						>
							{locale() === "ko" ? "개요" : "Overview"}
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("contacts")}
							class={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
								activeTab() === "contacts"
									? "bg-violet-600/20 text-violet-400"
									: "bg-gray-800 text-gray-400 hover:text-white"
							}`}
						>
							{locale() === "ko" ? "연락 요청" : "Contact Requests"}
							<Show when={stats().pendingContacts > 0}>
								<span class="ml-2 px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full">
									{stats().pendingContacts}
								</span>
							</Show>
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("applications")}
							class={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
								activeTab() === "applications"
									? "bg-violet-600/20 text-violet-400"
									: "bg-gray-800 text-gray-400 hover:text-white"
							}`}
						>
							{locale() === "ko" ? "지원 현황" : "Applications"}
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("referrals")}
							class={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
								activeTab() === "referrals"
									? "bg-violet-600/20 text-violet-400"
									: "bg-gray-800 text-gray-400 hover:text-white"
							}`}
						>
							{locale() === "ko" ? "추천 관리" : "Referrals"}
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("earnings")}
							class={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
								activeTab() === "earnings"
									? "bg-violet-600/20 text-violet-400"
									: "bg-gray-800 text-gray-400 hover:text-white"
							}`}
						>
							{locale() === "ko" ? "수익 관리" : "Earnings"}
						</button>
					</div>

					{/* Tab Content */}
					<Show when={activeTab() === "overview"}>
						<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Recent Activity */}
							<div class="lg:col-span-2">
								<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
									<h2 class="text-xl font-bold text-white mb-4">
										{locale() === "ko" ? "최근 활동" : "Recent Activity"}
									</h2>
									<div class="space-y-4">
										<For each={recentActivity()}>
											{(activity) => (
												<div class="flex items-start gap-3 pb-4 border-b border-gray-800 last:border-0">
													<span class="text-2xl">{getActivityIcon(activity.type)}</span>
													<div class="flex-1">
														<p class="text-gray-300">{activity.description}</p>
														<div class="flex items-center gap-4 mt-1">
															<span class="text-xs text-gray-500">{activity.timestamp}</span>
															<Show when={activity.amount}>
																<span class="text-xs text-green-400">+{activity.amount} USDC</span>
															</Show>
														</div>
													</div>
												</div>
											)}
										</For>
									</div>
								</div>
							</div>

							{/* Quick Actions */}
							<div class="space-y-6">
								<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
									<h2 class="text-xl font-bold text-white mb-4">
										{locale() === "ko" ? "빠른 실행" : "Quick Actions"}
									</h2>
									<div class="space-y-3">
										<A
											href="/me"
											class="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
										>
											<span class="text-gray-300">{locale() === "ko" ? "프로필 편집" : "Edit Profile"}</span>
											<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
											</svg>
										</A>
										<A
											href="/jobs/new"
											class="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
										>
											<span class="text-gray-300">{locale() === "ko" ? "채용 공고 등록" : "Post a Job"}</span>
											<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
											</svg>
										</A>
										<A
											href="/me/monetization"
											class="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
										>
											<span class="text-gray-300">{locale() === "ko" ? "레쥬메 판매" : "Sell Resume"}</span>
											<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
											</svg>
										</A>
									</div>
								</div>

								{/* Profile Stats */}
								<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
									<h2 class="text-xl font-bold text-white mb-4">
										{locale() === "ko" ? "프로필 통계" : "Profile Stats"}
									</h2>
									<div class="space-y-3">
										<div class="flex justify-between">
											<span class="text-gray-400">{locale() === "ko" ? "프로필 조회" : "Profile Views"}</span>
											<span class="text-white font-medium">{stats().profileViews}</span>
										</div>
										<div class="flex justify-between">
											<span class="text-gray-400">{locale() === "ko" ? "응답률" : "Response Rate"}</span>
											<span class="text-white font-medium">{stats().responseRate}%</span>
										</div>
										<div class="flex justify-between">
											<span class="text-gray-400">{locale() === "ko" ? "레쥬메 판매" : "Resume Sales"}</span>
											<span class="text-white font-medium">{stats().resumeSales}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Show>

					<Show when={activeTab() === "contacts"}>
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<h2 class="text-xl font-bold text-white mb-4">
								{locale() === "ko" ? "연락 요청" : "Contact Requests"}
							</h2>
							<div class="space-y-4">
								<For each={contactRequests()}>
									{(request) => (
										<div class="bg-gray-800/50 rounded-lg p-4">
											<div class="flex items-start justify-between mb-3">
												<div>
													<p class="text-white font-medium">{request.fromName}</p>
													<p class="text-gray-400 text-sm">{request.from}</p>
												</div>
												<span class={`px-2 py-1 text-xs rounded-full border ${getStatusColor(request.status)}`}>
													{request.status}
												</span>
											</div>
											<p class="text-gray-300 mb-3">{request.message}</p>
											<div class="flex items-center justify-between">
												<div class="flex items-center gap-4 text-sm text-gray-400">
													<span>{request.timestamp}</span>
													<span class="text-violet-400">{request.amount} USDC</span>
												</div>
												<Show when={request.status === "pending"}>
													<div class="flex gap-2">
														<button
															type="button"
															class="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
														>
															{locale() === "ko" ? "수락" : "Accept"}
														</button>
														<button
															type="button"
															class="px-3 py-1 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
														>
															{locale() === "ko" ? "거절" : "Reject"}
														</button>
													</div>
												</Show>
											</div>
										</div>
									)}
								</For>
							</div>
						</div>
					</Show>

					<Show when={activeTab() === "applications"}>
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<h2 class="text-xl font-bold text-white mb-4">
								{locale() === "ko" ? "지원 현황" : "Application Status"}
							</h2>
							<div class="overflow-x-auto">
								<table class="w-full">
									<thead>
										<tr class="border-b border-gray-800">
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "회사" : "Company"}
											</th>
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "직무" : "Position"}
											</th>
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "지원일" : "Applied"}
											</th>
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "추천인" : "Referrer"}
											</th>
											<th class="text-left py-3 px-4 text-gray-400 font-medium">
												{locale() === "ko" ? "상태" : "Status"}
											</th>
										</tr>
									</thead>
									<tbody>
										<For each={applications()}>
											{(app) => (
												<tr class="border-b border-gray-800/50">
													<td class="py-3 px-4 text-white">{app.company}</td>
													<td class="py-3 px-4 text-gray-300">{app.jobTitle}</td>
													<td class="py-3 px-4 text-gray-400">{app.appliedAt}</td>
													<td class="py-3 px-4 text-gray-400">{app.referredBy || "-"}</td>
													<td class="py-3 px-4">
														<span class={`px-2 py-1 text-xs rounded-full border ${getStatusColor(app.status)}`}>
															{app.status}
														</span>
													</td>
												</tr>
											)}
										</For>
									</tbody>
								</table>
							</div>
						</div>
					</Show>

					<Show when={activeTab() === "referrals"}>
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
							<h2 class="text-xl font-bold text-white mb-4">
								{locale() === "ko" ? "추천 관리" : "Referral Management"}
							</h2>
							<div class="grid gap-4">
								<For each={referrals()}>
									{(referral) => (
										<div class="bg-gray-800/50 rounded-lg p-4">
											<div class="flex items-start justify-between mb-3">
												<div>
													<p class="text-white font-medium">{referral.candidateName}</p>
													<p class="text-gray-400">{referral.jobTitle} @ {referral.company}</p>
												</div>
												<span class={`px-2 py-1 text-xs rounded-full border ${getStatusColor(referral.status)}`}>
													{referral.status}
												</span>
											</div>
											<div class="flex items-center justify-between">
												<span class="text-gray-400 text-sm">{referral.referredAt}</span>
												<span class="text-violet-400 font-medium">
													{locale() === "ko" ? "예상 보상: " : "Potential: "}
													{referral.potentialReward} USDC
												</span>
											</div>
										</div>
									)}
								</For>
							</div>
						</div>
					</Show>

					<Show when={activeTab() === "earnings"}>
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
								<h2 class="text-xl font-bold text-white mb-4">
									{locale() === "ko" ? "수익 상세" : "Earnings Breakdown"}
								</h2>
								<div class="space-y-4">
									<div class="flex justify-between pb-3 border-b border-gray-800">
										<span class="text-gray-400">{locale() === "ko" ? "연락 응답" : "Contact Responses"}</span>
										<span class="text-white font-medium">125 USDC</span>
									</div>
									<div class="flex justify-between pb-3 border-b border-gray-800">
										<span class="text-gray-400">{locale() === "ko" ? "추천 보상" : "Referral Rewards"}</span>
										<span class="text-white font-medium">150 USDC</span>
									</div>
									<div class="flex justify-between pb-3 border-b border-gray-800">
										<span class="text-gray-400">{locale() === "ko" ? "레쥬메 판매" : "Resume Sales"}</span>
										<span class="text-white font-medium">67 USDC</span>
									</div>
									<div class="flex justify-between pt-3">
										<span class="text-white font-medium">{locale() === "ko" ? "총 수익" : "Total Earnings"}</span>
										<span class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
											342 USDC
										</span>
									</div>
								</div>
							</div>

							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
								<h2 class="text-xl font-bold text-white mb-4">
									{locale() === "ko" ? "출금" : "Withdraw"}
								</h2>
								<div class="space-y-4">
									<div class="bg-gray-800 rounded-lg p-4">
										<p class="text-gray-400 text-sm mb-1">
											{locale() === "ko" ? "출금 가능 잔액" : "Available Balance"}
										</p>
										<p class="text-3xl font-bold text-white">342 USDC</p>
									</div>
									<button
										type="button"
										class="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
									>
										{locale() === "ko" ? "출금하기" : "Withdraw Funds"}
									</button>
									<p class="text-gray-400 text-xs text-center">
										{locale() === "ko"
											? "출금은 연결된 지갑으로 즉시 처리됩니다"
											: "Withdrawals are processed instantly to your connected wallet"}
									</p>
								</div>
							</div>
						</div>
					</Show>
				</div>
			</main>
		</Show>
	);
}