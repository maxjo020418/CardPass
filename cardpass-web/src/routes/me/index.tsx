import { createSignal, Show, For, onMount } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { useI18n } from "~/contexts/i18n";
import { useWallet } from "~/store/wallet";

interface ProfileData {
	name: string;
	handle: string;
	title: string;
	company: string;
	location: string;
	bio: string;
	skills: string[];
	experience: string;
	languages: string[];
	email: string;
	website: string;
	linkedin: string;
	twitter: string;
	github: string;
	contactPrice: number;
	responseTime: string;
	isPublic: boolean;
	isAvailable: boolean;
	autoRejectThreshold: number;
	customMessage: string;
}

export default function ProfileSettings() {
	const { t, locale } = useI18n();
	const navigate = useNavigate();
	const { connected, publicKey } = useWallet();

	// Check authentication on mount
	onMount(() => {
		if (!connected()) {
			navigate("/", { replace: true });
		}
	});

	// Form state
	const [profileData, setProfileData] = createSignal<ProfileData>({
		name: locale() === "ko" ? "김알렉스" : "Alex Kim",
		handle: "alex-kim",
		title: locale() === "ko" ? "시니어 프론트엔드 개발자" : "Senior Frontend Developer",
		company: "TechCorp",
		location: locale() === "ko" ? "서울, 한국" : "Seoul, Korea",
		bio: locale() === "ko"
			? "10년 경력의 프론트엔드 전문가입니다. React, Vue, Solid 등 다양한 프레임워크 경험을 보유하고 있습니다."
			: "Frontend expert with 10 years of experience. Extensive experience with React, Vue, and Solid frameworks.",
		skills: ["React", "TypeScript", "Solana", "Web3"],
		experience: locale() === "ko" ? "10년" : "10 years",
		languages: locale() === "ko" ? ["한국어", "영어"] : ["Korean", "English"],
		email: "alex@example.com",
		website: "alexkim.dev",
		linkedin: "linkedin.com/in/alexkim",
		twitter: "@alexkim",
		github: "github.com/alexkim",
		contactPrice: 50,
		responseTime: "24",
		isPublic: true,
		isAvailable: true,
		autoRejectThreshold: 10,
		customMessage: locale() === "ko"
			? "가치 있는 연결을 기다리고 있습니다."
			: "Looking forward to valuable connections.",
	});

	const [newSkill, setNewSkill] = createSignal("");
	const [newLanguage, setNewLanguage] = createSignal("");
	const [showSaveSuccess, setShowSaveSuccess] = createSignal(false);
	const [activeSection, setActiveSection] = createSignal<"basic" | "contact" | "social" | "privacy">("basic");

	const handleAddSkill = () => {
		if (newSkill().trim()) {
			setProfileData(prev => ({
				...prev,
				skills: [...prev.skills, newSkill().trim()]
			}));
			setNewSkill("");
		}
	};

	const handleRemoveSkill = (index: number) => {
		setProfileData(prev => ({
			...prev,
			skills: prev.skills.filter((_, i) => i !== index)
		}));
	};

	const handleAddLanguage = () => {
		if (newLanguage().trim()) {
			setProfileData(prev => ({
				...prev,
				languages: [...prev.languages, newLanguage().trim()]
			}));
			setNewLanguage("");
		}
	};

	const handleRemoveLanguage = (index: number) => {
		setProfileData(prev => ({
			...prev,
			languages: prev.languages.filter((_, i) => i !== index)
		}));
	};

	const handleSave = () => {
		// Mock save
		console.log("Saving profile:", profileData());
		setShowSaveSuccess(true);
		setTimeout(() => setShowSaveSuccess(false), 3000);
	};

	const handleGenerateNFT = () => {
		console.log("Generating NFT business card...");
		// Mock NFT generation
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
								? "프로필을 수정하려면 지갑을 연결해주세요"
								: "Please connect your wallet to edit your profile"}
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
							{locale() === "ko" ? "프로필 설정" : "Profile Settings"}
						</h1>
						<p class="text-gray-400">
							{locale() === "ko"
								? "프로필 정보와 연락 정책을 관리하세요"
								: "Manage your profile information and contact policies"}
						</p>
					</div>

					{/* Success Alert */}
					<Show when={showSaveSuccess()}>
						<div class="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg">
							<p class="text-green-400">
								{locale() === "ko" ? "✓ 프로필이 저장되었습니다" : "✓ Profile saved successfully"}
							</p>
						</div>
					</Show>

					<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
						{/* Sidebar Navigation */}
						<div class="lg:col-span-1">
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
								<nav class="space-y-2">
									<button
										type="button"
										onClick={() => setActiveSection("basic")}
										class={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
											activeSection() === "basic"
												? "bg-violet-600/20 text-violet-400"
												: "text-gray-400 hover:text-white hover:bg-gray-800"
										}`}
									>
										{locale() === "ko" ? "기본 정보" : "Basic Info"}
									</button>
									<button
										type="button"
										onClick={() => setActiveSection("contact")}
										class={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
											activeSection() === "contact"
												? "bg-violet-600/20 text-violet-400"
												: "text-gray-400 hover:text-white hover:bg-gray-800"
										}`}
									>
										{locale() === "ko" ? "연락 설정" : "Contact Settings"}
									</button>
									<button
										type="button"
										onClick={() => setActiveSection("social")}
										class={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
											activeSection() === "social"
												? "bg-violet-600/20 text-violet-400"
												: "text-gray-400 hover:text-white hover:bg-gray-800"
										}`}
									>
										{locale() === "ko" ? "소셜 링크" : "Social Links"}
									</button>
									<button
										type="button"
										onClick={() => setActiveSection("privacy")}
										class={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
											activeSection() === "privacy"
												? "bg-violet-600/20 text-violet-400"
												: "text-gray-400 hover:text-white hover:bg-gray-800"
										}`}
									>
										{locale() === "ko" ? "공개 설정" : "Privacy Settings"}
									</button>
								</nav>

								<div class="mt-6 pt-6 border-t border-gray-800">
									<p class="text-gray-400 text-sm mb-2">
										{locale() === "ko" ? "프로필 URL" : "Profile URL"}
									</p>
									<div class="bg-gray-800 rounded-lg p-3">
										<p class="text-white text-sm break-all">
											cardpass.io/r/{profileData().handle}
										</p>
									</div>
									<button
										type="button"
										onClick={() => {
											navigator.clipboard.writeText(`https://cardpass.io/r/${profileData().handle}`);
										}}
										class="w-full mt-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
									>
										{locale() === "ko" ? "링크 복사" : "Copy Link"}
									</button>
								</div>

								<div class="mt-6">
									<button
										type="button"
										onClick={handleGenerateNFT}
										class="w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
									>
										{locale() === "ko" ? "NFT 명함 발급" : "Generate NFT Card"}
									</button>
								</div>
							</div>
						</div>

						{/* Main Content */}
						<div class="lg:col-span-3">
							<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
								{/* Basic Info Section */}
								<Show when={activeSection() === "basic"}>
									<h2 class="text-2xl font-bold text-white mb-6">
										{locale() === "ko" ? "기본 정보" : "Basic Information"}
									</h2>
									<div class="space-y-6">
										<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<label class="block text-gray-400 text-sm mb-2">
													{locale() === "ko" ? "이름" : "Name"}
												</label>
												<input
													type="text"
													value={profileData().name}
													onInput={(e) => setProfileData(prev => ({ ...prev, name: e.currentTarget.value }))}
													class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
												/>
											</div>
											<div>
												<label class="block text-gray-400 text-sm mb-2">
													{locale() === "ko" ? "핸들" : "Handle"}
												</label>
												<input
													type="text"
													value={profileData().handle}
													onInput={(e) => setProfileData(prev => ({ ...prev, handle: e.currentTarget.value }))}
													class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
												/>
											</div>
											<div>
												<label class="block text-gray-400 text-sm mb-2">
													{locale() === "ko" ? "직함" : "Title"}
												</label>
												<input
													type="text"
													value={profileData().title}
													onInput={(e) => setProfileData(prev => ({ ...prev, title: e.currentTarget.value }))}
													class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
												/>
											</div>
											<div>
												<label class="block text-gray-400 text-sm mb-2">
													{locale() === "ko" ? "회사" : "Company"}
												</label>
												<input
													type="text"
													value={profileData().company}
													onInput={(e) => setProfileData(prev => ({ ...prev, company: e.currentTarget.value }))}
													class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
												/>
											</div>
											<div>
												<label class="block text-gray-400 text-sm mb-2">
													{locale() === "ko" ? "위치" : "Location"}
												</label>
												<input
													type="text"
													value={profileData().location}
													onInput={(e) => setProfileData(prev => ({ ...prev, location: e.currentTarget.value }))}
													class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
												/>
											</div>
											<div>
												<label class="block text-gray-400 text-sm mb-2">
													{locale() === "ko" ? "경력" : "Experience"}
												</label>
												<input
													type="text"
													value={profileData().experience}
													onInput={(e) => setProfileData(prev => ({ ...prev, experience: e.currentTarget.value }))}
													class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
												/>
											</div>
										</div>

										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "자기소개" : "Bio"}
											</label>
											<textarea
												value={profileData().bio}
												onInput={(e) => setProfileData(prev => ({ ...prev, bio: e.currentTarget.value }))}
												rows="4"
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
											/>
										</div>

										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "기술 스택" : "Skills"}
											</label>
											<div class="flex flex-wrap gap-2 mb-3">
												<For each={profileData().skills}>
													{(skill, index) => (
														<span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700 flex items-center gap-2">
															{skill}
															<button
																type="button"
																onClick={() => handleRemoveSkill(index())}
																class="text-gray-500 hover:text-red-400"
															>
																×
															</button>
														</span>
													)}
												</For>
											</div>
											<div class="flex gap-2">
												<input
													type="text"
													value={newSkill()}
													onInput={(e) => setNewSkill(e.currentTarget.value)}
													placeholder={locale() === "ko" ? "기술 추가..." : "Add skill..."}
													onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
													class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
												/>
												<button
													type="button"
													onClick={handleAddSkill}
													class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
												>
													{locale() === "ko" ? "추가" : "Add"}
												</button>
											</div>
										</div>

										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "언어" : "Languages"}
											</label>
											<div class="flex flex-wrap gap-2 mb-3">
												<For each={profileData().languages}>
													{(language, index) => (
														<span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700 flex items-center gap-2">
															{language}
															<button
																type="button"
																onClick={() => handleRemoveLanguage(index())}
																class="text-gray-500 hover:text-red-400"
															>
																×
															</button>
														</span>
													)}
												</For>
											</div>
											<div class="flex gap-2">
												<input
													type="text"
													value={newLanguage()}
													onInput={(e) => setNewLanguage(e.currentTarget.value)}
													placeholder={locale() === "ko" ? "언어 추가..." : "Add language..."}
													onKeyPress={(e) => e.key === "Enter" && handleAddLanguage()}
													class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
												/>
												<button
													type="button"
													onClick={handleAddLanguage}
													class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
												>
													{locale() === "ko" ? "추가" : "Add"}
												</button>
											</div>
										</div>
									</div>
								</Show>

								{/* Contact Settings Section */}
								<Show when={activeSection() === "contact"}>
									<h2 class="text-2xl font-bold text-white mb-6">
										{locale() === "ko" ? "연락 설정" : "Contact Settings"}
									</h2>
									<div class="space-y-6">
										<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<label class="block text-gray-400 text-sm mb-2">
													{locale() === "ko" ? "연락 비용 (USDC)" : "Contact Price (USDC)"}
												</label>
												<input
													type="number"
													value={profileData().contactPrice}
													onInput={(e) => setProfileData(prev => ({ ...prev, contactPrice: parseInt(e.currentTarget.value) || 0 }))}
													min="0"
													class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
												/>
												<p class="text-gray-500 text-xs mt-1">
													{locale() === "ko"
														? "연락을 받기 위해 예치해야 할 금액"
														: "Amount required to contact you"}
												</p>
											</div>
											<div>
												<label class="block text-gray-400 text-sm mb-2">
													{locale() === "ko" ? "응답 시간 (시간)" : "Response Time (hours)"}
												</label>
												<input
													type="text"
													value={profileData().responseTime}
													onInput={(e) => setProfileData(prev => ({ ...prev, responseTime: e.currentTarget.value }))}
													class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
												/>
												<p class="text-gray-500 text-xs mt-1">
													{locale() === "ko"
														? "평균 응답 시간을 입력하세요"
														: "Enter your average response time"}
												</p>
											</div>
										</div>

										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "자동 거절 임계값 (USDC)" : "Auto-reject Threshold (USDC)"}
											</label>
											<input
												type="number"
												value={profileData().autoRejectThreshold}
												onInput={(e) => setProfileData(prev => ({ ...prev, autoRejectThreshold: parseInt(e.currentTarget.value) || 0 }))}
												min="0"
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
											<p class="text-gray-500 text-xs mt-1">
												{locale() === "ko"
													? "이 금액 미만의 연락은 자동으로 거절됩니다 (0 = 비활성화)"
													: "Contacts below this amount will be auto-rejected (0 = disabled)"}
											</p>
										</div>

										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "연락 요청 메시지" : "Contact Request Message"}
											</label>
											<textarea
												value={profileData().customMessage}
												onInput={(e) => setProfileData(prev => ({ ...prev, customMessage: e.currentTarget.value }))}
												rows="3"
												placeholder={locale() === "ko"
													? "연락 요청자에게 보여질 메시지..."
													: "Message shown to contact requesters..."}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
											/>
										</div>

										<div class="flex items-center gap-3">
											<input
												type="checkbox"
												id="available"
												checked={profileData().isAvailable}
												onChange={(e) => setProfileData(prev => ({ ...prev, isAvailable: e.currentTarget.checked }))}
												class="w-5 h-5 bg-gray-800 border-gray-700 rounded focus:ring-violet-500 focus:ring-2"
											/>
											<label for="available" class="text-white">
												{locale() === "ko" ? "연락 가능 상태로 표시" : "Show as available for contact"}
											</label>
										</div>
									</div>
								</Show>

								{/* Social Links Section */}
								<Show when={activeSection() === "social"}>
									<h2 class="text-2xl font-bold text-white mb-6">
										{locale() === "ko" ? "소셜 링크" : "Social Links"}
									</h2>
									<div class="space-y-6">
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "이메일" : "Email"}
											</label>
											<input
												type="email"
												value={profileData().email}
												onInput={(e) => setProfileData(prev => ({ ...prev, email: e.currentTarget.value }))}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "웹사이트" : "Website"}
											</label>
											<input
												type="text"
												value={profileData().website}
												onInput={(e) => setProfileData(prev => ({ ...prev, website: e.currentTarget.value }))}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
										<div>
											<label class="block text-gray-400 text-sm mb-2">LinkedIn</label>
											<input
												type="text"
												value={profileData().linkedin}
												onInput={(e) => setProfileData(prev => ({ ...prev, linkedin: e.currentTarget.value }))}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
										<div>
											<label class="block text-gray-400 text-sm mb-2">Twitter</label>
											<input
												type="text"
												value={profileData().twitter}
												onInput={(e) => setProfileData(prev => ({ ...prev, twitter: e.currentTarget.value }))}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
										<div>
											<label class="block text-gray-400 text-sm mb-2">GitHub</label>
											<input
												type="text"
												value={profileData().github}
												onInput={(e) => setProfileData(prev => ({ ...prev, github: e.currentTarget.value }))}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
									</div>
								</Show>

								{/* Privacy Settings Section */}
								<Show when={activeSection() === "privacy"}>
									<h2 class="text-2xl font-bold text-white mb-6">
										{locale() === "ko" ? "공개 설정" : "Privacy Settings"}
									</h2>
									<div class="space-y-6">
										<div class="bg-gray-800/50 rounded-lg p-6">
											<div class="flex items-center justify-between mb-4">
												<div>
													<h3 class="text-white font-medium mb-1">
														{locale() === "ko" ? "프로필 공개" : "Public Profile"}
													</h3>
													<p class="text-gray-400 text-sm">
														{locale() === "ko"
															? "인재 목록 페이지에 프로필을 노출합니다"
															: "Show your profile in the talent directory"}
													</p>
												</div>
												<label class="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														checked={profileData().isPublic}
														onChange={(e) => setProfileData(prev => ({ ...prev, isPublic: e.currentTarget.checked }))}
														class="sr-only peer"
													/>
													<div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
												</label>
											</div>
											<div class="pt-4 border-t border-gray-700">
												<p class="text-gray-500 text-sm">
													{locale() === "ko"
														? "비공개 설정 시에도 고유 URL(cardpass.io/r/[handle])로는 접근 가능합니다"
														: "Even when private, your profile is still accessible via direct URL (cardpass.io/r/[handle])"}
												</p>
											</div>
										</div>

										<div class="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
											<p class="text-yellow-400 text-sm">
												<strong>{locale() === "ko" ? "주의:" : "Note:"}</strong> {locale() === "ko"
													? "프로필을 비공개로 설정하면 검색 결과와 인재 목록에서 제외되어 새로운 기회를 놓칠 수 있습니다."
													: "Setting your profile to private will exclude you from search results and talent listings, potentially missing opportunities."}
											</p>
										</div>
									</div>
								</Show>

								{/* Save Button */}
								<div class="mt-8 flex justify-end">
									<button
										type="button"
										onClick={handleSave}
										class="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
									>
										{locale() === "ko" ? "변경사항 저장" : "Save Changes"}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</Show>
	);
}