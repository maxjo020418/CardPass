import { useParams, A } from "@solidjs/router";
import { createMemo, createSignal, Show, For } from "solid-js";
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
	email?: string;
	linkedin?: string;
	twitter?: string;
	github?: string;
	website?: string;
	workHistory?: {
		company: string;
		title: string;
		period: string;
		description: string;
	}[];
	education?: {
		school: string;
		degree: string;
		year: string;
	}[];
	achievements?: string[];
	totalContacts?: number;
	responseRate?: number;
}

export default function PublicProfile() {
	const { t, locale } = useI18n();
	const params = useParams();
	const [showContactModal, setShowContactModal] = createSignal(false);
	const [showQRModal, setShowQRModal] = createSignal(false);
	const [contactMessage, setContactMessage] = createSignal("");
	const [copied, setCopied] = createSignal(false);

	// Mock profile data - in real app, would fetch based on handle
	const profile = createMemo<Profile | null>(() => {
		// Mock profiles database
		const profiles: Record<string, Profile> = {
			"alex-kim": {
				id: "1",
				handle: "alex-kim",
				name: locale() === "ko" ? "김알렉스" : "Alex Kim",
				title: locale() === "ko" ? "시니어 프론트엔드 개발자" : "Senior Frontend Developer",
				company: "TechCorp",
				location: locale() === "ko" ? "서울, 한국" : "Seoul, Korea",
				bio: locale() === "ko"
					? "10년 경력의 프론트엔드 전문가입니다. React, Vue, Solid 등 다양한 프레임워크 경험을 보유하고 있으며, 특히 Web3 및 블록체인 관련 프로젝트에 열정을 가지고 있습니다. 사용자 경험을 최우선으로 생각하며, 성능 최적화와 접근성을 중요시합니다."
					: "Frontend expert with 10 years of experience. Extensive experience with React, Vue, and Solid frameworks, with a passion for Web3 and blockchain projects. User experience is my top priority, with a focus on performance optimization and accessibility.",
				skills: ["React", "TypeScript", "Solana", "Web3", "Vue.js", "SolidJS", "TailwindCSS", "Node.js"],
				contactPrice: 50,
				responseTime: locale() === "ko" ? "24시간 이내" : "Within 24 hours",
				verified: true,
				experience: locale() === "ko" ? "10년" : "10 years",
				languages: locale() === "ko" ? ["한국어", "영어"] : ["Korean", "English"],
				isAvailable: true,
				email: "alex@example.com",
				linkedin: "linkedin.com/in/alexkim",
				twitter: "@alexkim",
				github: "github.com/alexkim",
				website: "alexkim.dev",
				workHistory: [
					{
						company: "TechCorp",
						title: locale() === "ko" ? "시니어 프론트엔드 개발자" : "Senior Frontend Developer",
						period: "2020 - Present",
						description: locale() === "ko"
							? "주요 제품의 프론트엔드 아키텍처 설계 및 개발 리드"
							: "Leading frontend architecture design and development for main products"
					},
					{
						company: "StartupXYZ",
						title: locale() === "ko" ? "프론트엔드 개발자" : "Frontend Developer",
						period: "2017 - 2020",
						description: locale() === "ko"
							? "B2B SaaS 플랫폼 개발 및 성능 최적화"
							: "B2B SaaS platform development and performance optimization"
					},
					{
						company: "WebAgency",
						title: locale() === "ko" ? "주니어 개발자" : "Junior Developer",
						period: "2014 - 2017",
						description: locale() === "ko"
							? "다양한 클라이언트 프로젝트 참여"
							: "Participated in various client projects"
					}
				],
				education: [
					{
						school: locale() === "ko" ? "서울대학교" : "Seoul National University",
						degree: locale() === "ko" ? "컴퓨터공학 학사" : "B.S. in Computer Science",
						year: "2014"
					}
				],
				achievements: locale() === "ko" ? [
					"2022 오픈소스 컨트리뷰터 어워드 수상",
					"React Korea 컨퍼런스 발표자 (2021)",
					"기술 블로그 월 5만 방문자"
				] : [
					"2022 Open Source Contributor Award",
					"React Korea Conference Speaker (2021)",
					"Tech blog with 50k monthly visitors"
				],
				totalContacts: 127,
				responseRate: 92
			},
			"sarah-chen": {
				id: "2",
				handle: "sarah-chen",
				name: locale() === "ko" ? "사라 첸" : "Sarah Chen",
				title: locale() === "ko" ? "블록체인 개발자" : "Blockchain Developer",
				company: "DeFi Labs",
				location: locale() === "ko" ? "싱가포르" : "Singapore",
				bio: locale() === "ko"
					? "솔라나 및 이더리움 전문 개발자입니다. DeFi 프로토콜 개발에 특화되어 있으며, 스마트 컨트랙트 보안 감사 경험도 보유하고 있습니다."
					: "Specialized in Solana and Ethereum development. Expert in DeFi protocol development with experience in smart contract security auditing.",
				skills: ["Solana", "Rust", "Smart Contracts", "DeFi", "Ethereum", "Solidity", "Web3.js"],
				contactPrice: 100,
				responseTime: locale() === "ko" ? "48시간 이내" : "Within 48 hours",
				verified: true,
				experience: locale() === "ko" ? "7년" : "7 years",
				languages: locale() === "ko" ? ["영어", "중국어"] : ["English", "Chinese"],
				isAvailable: true,
				totalContacts: 89,
				responseRate: 88
			}
		};

		return profiles[params.handle] || null;
	});

	const profileUrl = createMemo(() => {
		if (typeof window !== "undefined") {
			return `${window.location.origin}/r/${params.handle}`;
		}
		return "";
	});

	const handleContact = () => {
		setShowContactModal(true);
	};

	const handleSendContact = () => {
		// Mock sending contact request
		console.log("Sending contact request with message:", contactMessage());
		setShowContactModal(false);
		setContactMessage("");
		// In real app, would send transaction and show success message
	};

	const copyProfileLink = async () => {
		try {
			await navigator.clipboard.writeText(profileUrl());
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<main class="min-h-screen bg-gradient-to-b from-gray-900 to-black">
			<Show
				when={profile()}
				fallback={
					<div class="container mx-auto px-4 py-20">
						<div class="text-center">
							<h1 class="text-3xl font-bold text-white mb-4">
								{locale() === "ko" ? "프로필을 찾을 수 없습니다" : "Profile not found"}
							</h1>
							<p class="text-gray-400 mb-8">
								@{params.handle} {locale() === "ko" ? "사용자가 존재하지 않습니다" : "does not exist"}
							</p>
							<A href="/profiles" class="text-violet-400 hover:text-violet-300">
								{locale() === "ko" ? "인재 목록으로 돌아가기" : "Back to profiles"}
							</A>
						</div>
					</div>
				}
			>
				{(currentProfile) => (
					<div class="container mx-auto px-4 py-12">
						{/* Back button */}
						<div class="mb-8">
							<A
								href="/profiles"
								class="inline-flex items-center text-gray-400 hover:text-white transition-colors"
							>
								<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
								</svg>
								{locale() === "ko" ? "인재 목록" : "Back to profiles"}
							</A>
						</div>

						{/* Profile Header */}
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
							<div class="flex flex-col md:flex-row gap-8">
								{/* Avatar and Basic Info */}
								<div class="flex flex-col items-center md:items-start">
									<div class="w-32 h-32 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
										{currentProfile().name.charAt(0)}
									</div>
									<div class="text-center md:text-left">
										<h1 class="text-3xl font-bold text-white flex items-center gap-2 mb-2">
											{currentProfile().name}
											<Show when={currentProfile().verified}>
												<svg class="w-7 h-7 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
													<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
												</svg>
											</Show>
										</h1>
										<p class="text-xl text-gray-400 mb-1">@{currentProfile().handle}</p>
										<p class="text-lg text-gray-300">{currentProfile().title}</p>
										<p class="text-gray-400">{currentProfile().company} • {currentProfile().location}</p>
									</div>
								</div>

								{/* Contact Info and Actions */}
								<div class="flex-1">
									<div class="bg-gray-800/50 rounded-lg p-6 mb-4">
										<div class="grid grid-cols-2 gap-4 mb-4">
											<div>
												<p class="text-gray-400 text-sm mb-1">
													{locale() === "ko" ? "연락 비용" : "Contact Price"}
												</p>
												<p class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
													{currentProfile().contactPrice} USDC
												</p>
											</div>
											<div>
												<p class="text-gray-400 text-sm mb-1">
													{locale() === "ko" ? "응답 시간" : "Response Time"}
												</p>
												<p class="text-lg text-white">{currentProfile().responseTime}</p>
											</div>
											<div>
												<p class="text-gray-400 text-sm mb-1">
													{locale() === "ko" ? "응답률" : "Response Rate"}
												</p>
												<p class="text-lg text-white">{currentProfile().responseRate}%</p>
											</div>
											<div>
												<p class="text-gray-400 text-sm mb-1">
													{locale() === "ko" ? "총 연락" : "Total Contacts"}
												</p>
												<p class="text-lg text-white">{currentProfile().totalContacts}</p>
											</div>
										</div>

										<Show
											when={currentProfile().isAvailable}
											fallback={
												<div class="bg-red-900/20 border border-red-800 rounded-lg p-3 text-center">
													<p class="text-red-400">
														{locale() === "ko" ? "현재 연락 불가능" : "Currently unavailable"}
													</p>
												</div>
											}
										>
											<button
												type="button"
												onClick={handleContact}
												class="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all text-lg"
											>
												{locale() === "ko" ? "연락하기" : "Contact"} ({currentProfile().contactPrice} USDC)
											</button>
										</Show>
									</div>

									{/* Action Buttons */}
									<div class="flex gap-2">
										<button
											type="button"
											onClick={() => setShowQRModal(true)}
											class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
										>
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
											</svg>
											{locale() === "ko" ? "QR 코드" : "QR Code"}
										</button>
										<button
											type="button"
											onClick={copyProfileLink}
											class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
										>
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
											</svg>
											{copied()
												? (locale() === "ko" ? "복사됨!" : "Copied!")
												: (locale() === "ko" ? "링크 복사" : "Copy Link")}
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Bio */}
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
							<h2 class="text-2xl font-bold text-white mb-4">
								{locale() === "ko" ? "소개" : "About"}
							</h2>
							<p class="text-gray-400 leading-relaxed">{currentProfile().bio}</p>
						</div>

						{/* Skills */}
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
							<h2 class="text-2xl font-bold text-white mb-4">
								{locale() === "ko" ? "기술 스택" : "Skills"}
							</h2>
							<div class="flex flex-wrap gap-2">
								<For each={currentProfile().skills}>
									{(skill) => (
										<span class="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700">
											{skill}
										</span>
									)}
								</For>
							</div>
						</div>

						{/* Work History */}
						<Show when={currentProfile().workHistory && currentProfile().workHistory!.length > 0}>
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
								<h2 class="text-2xl font-bold text-white mb-4">
									{locale() === "ko" ? "경력 사항" : "Work Experience"}
								</h2>
								<div class="space-y-6">
									<For each={currentProfile().workHistory}>
										{(work) => (
											<div class="border-l-2 border-violet-500/30 pl-6 relative">
												<div class="absolute left-0 top-0 w-3 h-3 bg-violet-500 rounded-full -translate-x-[7px]"></div>
												<h3 class="text-xl font-semibold text-white">{work.title}</h3>
												<p class="text-gray-400 mb-2">{work.company} • {work.period}</p>
												<p class="text-gray-400">{work.description}</p>
											</div>
										)}
									</For>
								</div>
							</div>
						</Show>

						{/* Education */}
						<Show when={currentProfile().education && currentProfile().education!.length > 0}>
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
								<h2 class="text-2xl font-bold text-white mb-4">
									{locale() === "ko" ? "학력" : "Education"}
								</h2>
								<div class="space-y-4">
									<For each={currentProfile().education}>
										{(edu) => (
											<div>
												<h3 class="text-lg font-semibold text-white">{edu.school}</h3>
												<p class="text-gray-400">{edu.degree} • {edu.year}</p>
											</div>
										)}
									</For>
								</div>
							</div>
						</Show>

						{/* Achievements */}
						<Show when={currentProfile().achievements && currentProfile().achievements!.length > 0}>
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8 mb-8">
								<h2 class="text-2xl font-bold text-white mb-4">
									{locale() === "ko" ? "주요 성과" : "Achievements"}
								</h2>
								<ul class="space-y-2">
									<For each={currentProfile().achievements}>
										{(achievement) => (
											<li class="flex items-start text-gray-400">
												<span class="text-violet-400 mr-3 mt-1">•</span>
												<span>{achievement}</span>
											</li>
										)}
									</For>
								</ul>
							</div>
						</Show>

						{/* Languages & Additional Info */}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
								<h2 class="text-2xl font-bold text-white mb-4">
									{locale() === "ko" ? "언어" : "Languages"}
								</h2>
								<div class="flex flex-wrap gap-2">
									<For each={currentProfile().languages}>
										{(language) => (
											<span class="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700">
												{language}
											</span>
										)}
									</For>
								</div>
							</div>

							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
								<h2 class="text-2xl font-bold text-white mb-4">
									{locale() === "ko" ? "소셜 링크" : "Social Links"}
								</h2>
								<div class="space-y-2">
									<Show when={currentProfile().website}>
										<a
											href={`https://${currentProfile().website}`}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors"
										>
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
											</svg>
											{currentProfile().website}
										</a>
									</Show>
									<Show when={currentProfile().github}>
										<a
											href={`https://${currentProfile().github}`}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors"
										>
											<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
											</svg>
											{currentProfile().github}
										</a>
									</Show>
									<Show when={currentProfile().linkedin}>
										<a
											href={`https://${currentProfile().linkedin}`}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors"
										>
											<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
											</svg>
											{currentProfile().linkedin}
										</a>
									</Show>
									<Show when={currentProfile().twitter}>
										<a
											href={`https://twitter.com/${currentProfile().twitter?.replace('@', '')}`}
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors"
										>
											<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
											</svg>
											{currentProfile().twitter}
										</a>
									</Show>
								</div>
							</div>
						</div>

						{/* Contact Modal */}
						<Show when={showContactModal()}>
							<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
								<div class="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full">
									<h3 class="text-xl font-bold text-white mb-4">
										{locale() === "ko" ? "연락 요청 보내기" : "Send Contact Request"}
									</h3>
									<div class="mb-4">
										<p class="text-gray-400 mb-2">
											{locale() === "ko"
												? `${currentProfile().contactPrice} USDC가 예치되며, ${currentProfile().name}님이 응답하면 환불됩니다.`
												: `${currentProfile().contactPrice} USDC will be deposited and refunded when ${currentProfile().name} responds.`}
										</p>
										<div class="bg-gray-800 rounded-lg p-4 mb-4">
											<p class="text-sm text-gray-400 mb-1">
												{locale() === "ko" ? "예상 응답 시간" : "Expected Response"}
											</p>
											<p class="text-white">{currentProfile().responseTime}</p>
										</div>
									</div>
									<div class="mb-4">
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "메시지" : "Message"}
										</label>
										<textarea
											value={contactMessage()}
											onInput={(e) => setContactMessage(e.currentTarget.value)}
											placeholder={locale() === "ko"
												? "간단한 소개와 연락 목적을 작성해주세요..."
												: "Write a brief introduction and your purpose..."}
											rows="4"
											class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
										/>
									</div>
									<div class="flex gap-2">
										<button
											type="button"
											onClick={handleSendContact}
											class="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
										>
											{locale() === "ko" ? "연락 요청 보내기" : "Send Request"} ({currentProfile().contactPrice} USDC)
										</button>
										<button
											type="button"
											onClick={() => setShowContactModal(false)}
											class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
										>
											{locale() === "ko" ? "취소" : "Cancel"}
										</button>
									</div>
								</div>
							</div>
						</Show>

						{/* QR Code Modal */}
						<Show when={showQRModal()}>
							<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
								<div class="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-sm w-full">
									<h3 class="text-xl font-bold text-white mb-4 text-center">
										{locale() === "ko" ? "프로필 QR 코드" : "Profile QR Code"}
									</h3>
									<div class="bg-white p-4 rounded-lg mb-4">
										{/* Mock QR Code - in real app would use QR library */}
										<div class="aspect-square bg-gray-200 flex items-center justify-center">
											<div class="text-gray-500 text-center">
												<svg class="w-32 h-32 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
													<path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 17h2v2h-2zM19 19h2v2h-2zM15 19h2v2h-2zM13 19h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z"/>
												</svg>
												<p class="text-xs">QR Code for @{params.handle}</p>
											</div>
										</div>
									</div>
									<p class="text-gray-400 text-sm text-center mb-4">
										{locale() === "ko"
											? "이 QR 코드를 스캔하여 프로필에 접속할 수 있습니다"
											: "Scan this QR code to access the profile"}
									</p>
									<button
										type="button"
										onClick={() => setShowQRModal(false)}
										class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
									>
										{locale() === "ko" ? "닫기" : "Close"}
									</button>
								</div>
							</div>
						</Show>
					</div>
				)}
			</Show>
		</main>
	);
}