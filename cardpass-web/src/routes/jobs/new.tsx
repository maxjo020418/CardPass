import { createSignal, Show, For, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useI18n } from "~/contexts/i18n";
import { useWallet } from "~/store/wallet";

interface JobForm {
	title: string;
	company: string;
	location: string;
	type: string;
	salary: string;
	experience: string;
	description: string;
	requirements: string[];
	responsibilities: string[];
	benefits: string[];
	skills: string[];
	bountyAmount: number;
	bountyDistribution: {
		referrer: number;
		candidate: number;
	};
	applicationDeadline: string;
	remotePolicy: string;
	companyDescription: string;
	applicationEmail: string;
	applicationUrl: string;
}

export default function NewJob() {
	const { t, locale } = useI18n();
	const navigate = useNavigate();
	const { connected } = useWallet();

	// Check authentication on mount
	onMount(() => {
		if (!connected()) {
			navigate("/", { replace: true });
		}
	});

	const [currentStep, setCurrentStep] = createSignal(1);
	const [showPreview, setShowPreview] = createSignal(false);
	const [showConfirmModal, setShowConfirmModal] = createSignal(false);
	const [isSubmitting, setIsSubmitting] = createSignal(false);

	const [jobForm, setJobForm] = createSignal<JobForm>({
		title: "",
		company: "",
		location: "",
		type: locale() === "ko" ? "정규직" : "Full-time",
		salary: "",
		experience: locale() === "ko" ? "신입" : "Entry Level",
		description: "",
		requirements: [],
		responsibilities: [],
		benefits: [],
		skills: [],
		bountyAmount: 100,
		bountyDistribution: {
			referrer: 70,
			candidate: 30,
		},
		applicationDeadline: "",
		remotePolicy: locale() === "ko" ? "사무실 근무" : "On-site",
		companyDescription: "",
		applicationEmail: "",
		applicationUrl: "",
	});

	const [newRequirement, setNewRequirement] = createSignal("");
	const [newResponsibility, setNewResponsibility] = createSignal("");
	const [newBenefit, setNewBenefit] = createSignal("");
	const [newSkill, setNewSkill] = createSignal("");

	const steps = () => [
		{ id: 1, title: locale() === "ko" ? "기본 정보" : "Basic Info" },
		{ id: 2, title: locale() === "ko" ? "상세 정보" : "Details" },
		{ id: 3, title: locale() === "ko" ? "바운티 설정" : "Bounty Setup" },
		{ id: 4, title: locale() === "ko" ? "검토 및 게시" : "Review & Post" },
	];

	const handleAddItem = (
		type: "requirements" | "responsibilities" | "benefits" | "skills",
		value: string,
		setter: (value: string) => void
	) => {
		if (value.trim()) {
			setJobForm(prev => ({
				...prev,
				[type]: [...prev[type], value.trim()]
			}));
			setter("");
		}
	};

	const handleRemoveItem = (
		type: "requirements" | "responsibilities" | "benefits" | "skills",
		index: number
	) => {
		setJobForm(prev => ({
			...prev,
			[type]: prev[type].filter((_, i) => i !== index)
		}));
	};

	const updateBountyDistribution = (field: "referrer" | "candidate", value: number) => {
		const other = field === "referrer" ? "candidate" : "referrer";
		setJobForm(prev => ({
			...prev,
			bountyDistribution: {
				[field]: value,
				[other]: 100 - value,
			}
		}));
	};

	const isStepValid = (step: number): boolean => {
		const form = jobForm();
		switch (step) {
			case 1:
				return !!(form.title && form.company && form.location && form.type && form.salary);
			case 2:
				return !!(form.description && form.requirements.length > 0 && form.responsibilities.length > 0);
			case 3:
				return form.bountyAmount >= 50;
			default:
				return true;
		}
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		// Mock submission
		console.log("Submitting job:", jobForm());
		await new Promise(resolve => setTimeout(resolve, 2000));
		setIsSubmitting(false);
		setShowConfirmModal(false);
		navigate("/jobs");
	};

	const calculateFees = () => {
		const bounty = jobForm().bountyAmount;
		const platformFee = bounty * 0.1; // 10% platform fee
		const total = bounty + platformFee;
		return { bounty, platformFee, total };
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
								? "채용 공고를 등록하려면 지갑을 연결해주세요"
								: "Please connect your wallet to post a job"}
						</p>
						<button
							type="button"
							onClick={() => navigate("/")}
							class="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all"
						>
							{locale() === "ko" ? "홈으로 돌아가기" : "Back to Home"}
						</button>
					</div>
				</main>
			}
		>
			<main class="min-h-screen bg-gradient-to-b from-gray-900 to-black">
				<div class="container mx-auto px-4 py-12">
					{/* Header */}
					<div class="mb-8">
						<h1 class="text-4xl font-bold text-white mb-2">
							{locale() === "ko" ? "채용 공고 등록" : "Post a Job"}
						</h1>
						<p class="text-gray-400">
							{locale() === "ko"
								? "인재를 찾고 채용 성공에 대해 자동으로 보상하세요"
								: "Find talent and automatically reward successful hires"}
						</p>
					</div>

					{/* Progress Steps */}
					<div class="mb-8">
						<div class="flex items-center justify-between">
							<For each={steps()}>
								{(step, index) => (
									<>
										<div class="flex items-center">
											<div
												class={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
													currentStep() > step.id
														? "bg-green-600 text-white"
														: currentStep() === step.id
														? "bg-violet-600 text-white"
														: "bg-gray-800 text-gray-400"
												}`}
											>
												<Show
													when={currentStep() > step.id}
													fallback={step.id}
												>
													<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
													</svg>
												</Show>
											</div>
											<span class={`ml-3 hidden md:inline ${
												currentStep() >= step.id ? "text-white" : "text-gray-400"
											}`}>
												{step.title}
											</span>
										</div>
										<Show when={index() < steps().length - 1}>
											<div class={`flex-1 h-1 mx-4 rounded ${
												currentStep() > step.id ? "bg-green-600" : "bg-gray-800"
											}`} />
										</Show>
									</>
								)}
							</For>
						</div>
					</div>

					<Show when={!showPreview()}>
						{/* Form Content */}
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
							{/* Step 1: Basic Info */}
							<Show when={currentStep() === 1}>
								<h2 class="text-2xl font-bold text-white mb-6">
									{locale() === "ko" ? "기본 정보" : "Basic Information"}
								</h2>
								<div class="space-y-6">
									<div>
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "채용 직무 *" : "Job Title *"}
										</label>
										<input
											type="text"
											value={jobForm().title}
											onInput={(e) => setJobForm(prev => ({ ...prev, title: e.currentTarget.value }))}
											placeholder={locale() === "ko"
												? "예: 시니어 프론트엔드 개발자"
												: "e.g., Senior Frontend Developer"}
											class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
										/>
									</div>

									<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "회사명 *" : "Company Name *"}
											</label>
											<input
												type="text"
												value={jobForm().company}
												onInput={(e) => setJobForm(prev => ({ ...prev, company: e.currentTarget.value }))}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "근무 지역 *" : "Location *"}
											</label>
											<input
												type="text"
												value={jobForm().location}
												onInput={(e) => setJobForm(prev => ({ ...prev, location: e.currentTarget.value }))}
												placeholder={locale() === "ko" ? "예: 서울, 한국" : "e.g., Seoul, Korea"}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
									</div>

									<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "고용 형태 *" : "Employment Type *"}
											</label>
											<select
												value={jobForm().type}
												onChange={(e) => setJobForm(prev => ({ ...prev, type: e.currentTarget.value }))}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											>
												<option value={locale() === "ko" ? "정규직" : "Full-time"}>
													{locale() === "ko" ? "정규직" : "Full-time"}
												</option>
												<option value={locale() === "ko" ? "계약직" : "Contract"}>
													{locale() === "ko" ? "계약직" : "Contract"}
												</option>
												<option value={locale() === "ko" ? "프리랜서" : "Freelance"}>
													{locale() === "ko" ? "프리랜서" : "Freelance"}
												</option>
												<option value={locale() === "ko" ? "인턴" : "Internship"}>
													{locale() === "ko" ? "인턴" : "Internship"}
												</option>
											</select>
										</div>
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "경력 요구사항" : "Experience Level"}
											</label>
											<select
												value={jobForm().experience}
												onChange={(e) => setJobForm(prev => ({ ...prev, experience: e.currentTarget.value }))}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											>
												<option value={locale() === "ko" ? "신입" : "Entry Level"}>
													{locale() === "ko" ? "신입" : "Entry Level"}
												</option>
												<option value={locale() === "ko" ? "주니어 (1-3년)" : "Junior (1-3 years)"}>
													{locale() === "ko" ? "주니어 (1-3년)" : "Junior (1-3 years)"}
												</option>
												<option value={locale() === "ko" ? "미드레벨 (3-5년)" : "Mid-level (3-5 years)"}>
													{locale() === "ko" ? "미드레벨 (3-5년)" : "Mid-level (3-5 years)"}
												</option>
												<option value={locale() === "ko" ? "시니어 (5년+)" : "Senior (5+ years)"}>
													{locale() === "ko" ? "시니어 (5년+)" : "Senior (5+ years)"}
												</option>
											</select>
										</div>
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "원격 근무" : "Remote Policy"}
											</label>
											<select
												value={jobForm().remotePolicy}
												onChange={(e) => setJobForm(prev => ({ ...prev, remotePolicy: e.currentTarget.value }))}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											>
												<option value={locale() === "ko" ? "사무실 근무" : "On-site"}>
													{locale() === "ko" ? "사무실 근무" : "On-site"}
												</option>
												<option value={locale() === "ko" ? "완전 원격" : "Fully Remote"}>
													{locale() === "ko" ? "완전 원격" : "Fully Remote"}
												</option>
												<option value={locale() === "ko" ? "하이브리드" : "Hybrid"}>
													{locale() === "ko" ? "하이브리드" : "Hybrid"}
												</option>
											</select>
										</div>
									</div>

									<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "연봉 범위 *" : "Salary Range *"}
											</label>
											<input
												type="text"
												value={jobForm().salary}
												onInput={(e) => setJobForm(prev => ({ ...prev, salary: e.currentTarget.value }))}
												placeholder={locale() === "ko"
													? "예: 5,000 - 7,000만원"
													: "e.g., $50,000 - $70,000"}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "지원 마감일" : "Application Deadline"}
											</label>
											<input
												type="date"
												value={jobForm().applicationDeadline}
												onInput={(e) => setJobForm(prev => ({ ...prev, applicationDeadline: e.currentTarget.value }))}
												min={new Date().toISOString().split('T')[0]}
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
									</div>
								</div>
							</Show>

							{/* Step 2: Details */}
							<Show when={currentStep() === 2}>
								<h2 class="text-2xl font-bold text-white mb-6">
									{locale() === "ko" ? "상세 정보" : "Job Details"}
								</h2>
								<div class="space-y-6">
									<div>
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "회사 소개" : "About Company"}
										</label>
										<textarea
											value={jobForm().companyDescription}
											onInput={(e) => setJobForm(prev => ({ ...prev, companyDescription: e.currentTarget.value }))}
											rows="3"
											placeholder={locale() === "ko"
												? "회사에 대한 간단한 소개..."
												: "Brief introduction about your company..."}
											class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
										/>
									</div>

									<div>
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "업무 설명 *" : "Job Description *"}
										</label>
										<textarea
											value={jobForm().description}
											onInput={(e) => setJobForm(prev => ({ ...prev, description: e.currentTarget.value }))}
											rows="4"
											placeholder={locale() === "ko"
												? "담당하게 될 업무에 대해 설명해주세요..."
												: "Describe the role and what the candidate will be doing..."}
											class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
										/>
									</div>

									<div>
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "주요 업무 *" : "Key Responsibilities *"}
										</label>
										<div class="flex flex-wrap gap-2 mb-3">
											<For each={jobForm().responsibilities}>
												{(item, index) => (
													<span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700 flex items-center gap-2">
														{item}
														<button
															type="button"
															onClick={() => handleRemoveItem("responsibilities", index())}
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
												value={newResponsibility()}
												onInput={(e) => setNewResponsibility(e.currentTarget.value)}
												placeholder={locale() === "ko" ? "업무 추가..." : "Add responsibility..."}
												onKeyPress={(e) => e.key === "Enter" && handleAddItem("responsibilities", newResponsibility(), setNewResponsibility)}
												class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
											<button
												type="button"
												onClick={() => handleAddItem("responsibilities", newResponsibility(), setNewResponsibility)}
												class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
											>
												{locale() === "ko" ? "추가" : "Add"}
											</button>
										</div>
									</div>

									<div>
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "자격 요건 *" : "Requirements *"}
										</label>
										<div class="flex flex-wrap gap-2 mb-3">
											<For each={jobForm().requirements}>
												{(item, index) => (
													<span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700 flex items-center gap-2">
														{item}
														<button
															type="button"
															onClick={() => handleRemoveItem("requirements", index())}
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
												value={newRequirement()}
												onInput={(e) => setNewRequirement(e.currentTarget.value)}
												placeholder={locale() === "ko" ? "요건 추가..." : "Add requirement..."}
												onKeyPress={(e) => e.key === "Enter" && handleAddItem("requirements", newRequirement(), setNewRequirement)}
												class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
											<button
												type="button"
												onClick={() => handleAddItem("requirements", newRequirement(), setNewRequirement)}
												class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
											>
												{locale() === "ko" ? "추가" : "Add"}
											</button>
										</div>
									</div>

									<div>
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "필요 기술" : "Required Skills"}
										</label>
										<div class="flex flex-wrap gap-2 mb-3">
											<For each={jobForm().skills}>
												{(item, index) => (
													<span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700 flex items-center gap-2">
														{item}
														<button
															type="button"
															onClick={() => handleRemoveItem("skills", index())}
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
												placeholder={locale() === "ko" ? "기술 추가 (예: React, TypeScript)" : "Add skill (e.g., React, TypeScript)"}
												onKeyPress={(e) => e.key === "Enter" && handleAddItem("skills", newSkill(), setNewSkill)}
												class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
											<button
												type="button"
												onClick={() => handleAddItem("skills", newSkill(), setNewSkill)}
												class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
											>
												{locale() === "ko" ? "추가" : "Add"}
											</button>
										</div>
									</div>

									<div>
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "복리후생" : "Benefits"}
										</label>
										<div class="flex flex-wrap gap-2 mb-3">
											<For each={jobForm().benefits}>
												{(item, index) => (
													<span class="px-3 py-1 bg-gray-800 text-gray-300 rounded-full border border-gray-700 flex items-center gap-2">
														{item}
														<button
															type="button"
															onClick={() => handleRemoveItem("benefits", index())}
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
												value={newBenefit()}
												onInput={(e) => setNewBenefit(e.currentTarget.value)}
												placeholder={locale() === "ko" ? "복리후생 추가..." : "Add benefit..."}
												onKeyPress={(e) => e.key === "Enter" && handleAddItem("benefits", newBenefit(), setNewBenefit)}
												class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
											<button
												type="button"
												onClick={() => handleAddItem("benefits", newBenefit(), setNewBenefit)}
												class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
											>
												{locale() === "ko" ? "추가" : "Add"}
											</button>
										</div>
									</div>
								</div>
							</Show>

							{/* Step 3: Bounty Setup */}
							<Show when={currentStep() === 3}>
								<h2 class="text-2xl font-bold text-white mb-6">
									{locale() === "ko" ? "채용 바운티 설정" : "Hiring Bounty Setup"}
								</h2>

								<div class="bg-gradient-to-r from-violet-900/20 to-cyan-900/20 rounded-lg p-6 mb-8">
									<h3 class="text-lg font-semibold text-white mb-3">
										{locale() === "ko" ? "💰 바운티란?" : "💰 What is a Bounty?"}
									</h3>
									<p class="text-gray-300 mb-3">
										{locale() === "ko"
											? "채용 바운티는 채용 성공 시 자동으로 분배되는 보상금입니다. 소개자와 합격자에게 나누어 지급되며, 직접 지원의 경우 합격자가 전액을 받습니다."
											: "A hiring bounty is a reward automatically distributed upon successful hiring. It's split between the referrer and the candidate, or fully given to the candidate for direct applications."}
									</p>
									<ul class="space-y-2 text-gray-300 text-sm">
										<li class="flex items-start">
											<span class="text-green-400 mr-2">✓</span>
											{locale() === "ko"
												? "더 많은 지원자와 추천을 유도합니다"
												: "Attracts more applicants and referrals"}
										</li>
										<li class="flex items-start">
											<span class="text-green-400 mr-2">✓</span>
											{locale() === "ko"
												? "스마트 컨트랙트로 자동 정산됩니다"
												: "Automatically settled via smart contract"}
										</li>
										<li class="flex items-start">
											<span class="text-green-400 mr-2">✓</span>
											{locale() === "ko"
												? "채용 성공률을 크게 높입니다"
												: "Significantly increases hiring success rate"}
										</li>
									</ul>
								</div>

								<div class="space-y-6">
									<div>
										<label class="block text-gray-400 text-sm mb-2">
											{locale() === "ko" ? "바운티 금액 (USDC) *" : "Bounty Amount (USDC) *"}
										</label>
										<input
											type="number"
											value={jobForm().bountyAmount}
											onInput={(e) => setJobForm(prev => ({ ...prev, bountyAmount: parseInt(e.currentTarget.value) || 0 }))}
											min="50"
											step="50"
											class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
										/>
										<p class="text-gray-500 text-xs mt-1">
											{locale() === "ko"
												? "최소 50 USDC, 권장 100-500 USDC"
												: "Minimum 50 USDC, recommended 100-500 USDC"}
										</p>
									</div>

									<div>
										<label class="block text-gray-400 text-sm mb-4">
											{locale() === "ko" ? "바운티 분배 비율" : "Bounty Distribution"}
										</label>
										<div class="space-y-4">
											<div>
												<div class="flex justify-between mb-2">
													<span class="text-white">
														{locale() === "ko" ? "소개자 보상" : "Referrer Reward"}
													</span>
													<span class="text-violet-400 font-medium">
														{jobForm().bountyDistribution.referrer}% ({Math.floor(jobForm().bountyAmount * jobForm().bountyDistribution.referrer / 100)} USDC)
													</span>
												</div>
												<input
													type="range"
													min="0"
													max="100"
													step="10"
													value={jobForm().bountyDistribution.referrer}
													onInput={(e) => updateBountyDistribution("referrer", parseInt(e.currentTarget.value))}
													class="w-full accent-violet-600"
												/>
											</div>
											<div>
												<div class="flex justify-between mb-2">
													<span class="text-white">
														{locale() === "ko" ? "합격자 보상" : "Candidate Reward"}
													</span>
													<span class="text-cyan-400 font-medium">
														{jobForm().bountyDistribution.candidate}% ({Math.floor(jobForm().bountyAmount * jobForm().bountyDistribution.candidate / 100)} USDC)
													</span>
												</div>
												<input
													type="range"
													min="0"
													max="100"
													step="10"
													value={jobForm().bountyDistribution.candidate}
													onInput={(e) => updateBountyDistribution("candidate", parseInt(e.currentTarget.value))}
													class="w-full accent-cyan-600"
												/>
											</div>
										</div>
										<p class="text-gray-500 text-xs mt-3">
											{locale() === "ko"
												? "* 직접 지원의 경우 합격자가 100% 받습니다"
												: "* Direct applicants receive 100% if hired"}
										</p>
									</div>

									<div class="bg-gray-800 rounded-lg p-6">
										<h4 class="text-white font-medium mb-3">
											{locale() === "ko" ? "예상 비용" : "Estimated Cost"}
										</h4>
										<div class="space-y-2">
											<div class="flex justify-between text-gray-400">
												<span>{locale() === "ko" ? "바운티 금액" : "Bounty Amount"}</span>
												<span>{calculateFees().bounty} USDC</span>
											</div>
											<div class="flex justify-between text-gray-400">
												<span>{locale() === "ko" ? "플랫폼 수수료 (10%)" : "Platform Fee (10%)"}</span>
												<span>{calculateFees().platformFee} USDC</span>
											</div>
											<div class="flex justify-between text-white font-medium text-lg pt-2 border-t border-gray-700">
												<span>{locale() === "ko" ? "총 예치금" : "Total Deposit"}</span>
												<span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
													{calculateFees().total} USDC
												</span>
											</div>
										</div>
									</div>

									<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "지원 이메일" : "Application Email"}
											</label>
											<input
												type="email"
												value={jobForm().applicationEmail}
												onInput={(e) => setJobForm(prev => ({ ...prev, applicationEmail: e.currentTarget.value }))}
												placeholder="hr@company.com"
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
										<div>
											<label class="block text-gray-400 text-sm mb-2">
												{locale() === "ko" ? "지원 링크" : "Application URL"}
											</label>
											<input
												type="url"
												value={jobForm().applicationUrl}
												onInput={(e) => setJobForm(prev => ({ ...prev, applicationUrl: e.currentTarget.value }))}
												placeholder="https://company.com/careers"
												class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
											/>
										</div>
									</div>
								</div>
							</Show>

							{/* Step 4: Review */}
							<Show when={currentStep() === 4}>
								<h2 class="text-2xl font-bold text-white mb-6">
									{locale() === "ko" ? "검토 및 게시" : "Review & Post"}
								</h2>

								<div class="bg-gray-800/50 rounded-lg p-6 mb-6">
									<h3 class="text-lg font-semibold text-white mb-4">
										{locale() === "ko" ? "공고 요약" : "Job Summary"}
									</h3>
									<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
										<div>
											<span class="text-gray-400">{locale() === "ko" ? "직무:" : "Title:"}</span>
											<span class="text-white ml-2">{jobForm().title}</span>
										</div>
										<div>
											<span class="text-gray-400">{locale() === "ko" ? "회사:" : "Company:"}</span>
											<span class="text-white ml-2">{jobForm().company}</span>
										</div>
										<div>
											<span class="text-gray-400">{locale() === "ko" ? "위치:" : "Location:"}</span>
											<span class="text-white ml-2">{jobForm().location}</span>
										</div>
										<div>
											<span class="text-gray-400">{locale() === "ko" ? "연봉:" : "Salary:"}</span>
											<span class="text-white ml-2">{jobForm().salary}</span>
										</div>
										<div>
											<span class="text-gray-400">{locale() === "ko" ? "바운티:" : "Bounty:"}</span>
											<span class="text-violet-400 font-medium ml-2">{jobForm().bountyAmount} USDC</span>
										</div>
										<div>
											<span class="text-gray-400">{locale() === "ko" ? "총 비용:" : "Total Cost:"}</span>
											<span class="text-cyan-400 font-medium ml-2">{calculateFees().total} USDC</span>
										</div>
									</div>
								</div>

								<div class="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-6">
									<p class="text-yellow-400 text-sm">
										<strong>{locale() === "ko" ? "확인사항:" : "Please Confirm:"}</strong>
									</p>
									<ul class="mt-2 space-y-1 text-yellow-400 text-sm">
										<li>• {locale() === "ko"
											? "모든 정보가 정확한지 확인하셨나요?"
											: "Have you verified all information is accurate?"}</li>
										<li>• {locale() === "ko"
											? `${calculateFees().total} USDC가 즉시 예치됩니다`
											: `${calculateFees().total} USDC will be deposited immediately`}</li>
										<li>• {locale() === "ko"
											? "채용 성공 시 자동으로 바운티가 지급됩니다"
											: "Bounty will be automatically distributed upon successful hire"}</li>
									</ul>
								</div>

								<button
									type="button"
									onClick={() => setShowPreview(true)}
									class="w-full px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors mb-4"
								>
									{locale() === "ko" ? "미리보기" : "Preview Job Post"}
								</button>
							</Show>

							{/* Navigation Buttons */}
							<div class="flex justify-between mt-8">
								<button
									type="button"
									onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
									class={`px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors ${
										currentStep() === 1 ? "invisible" : ""
									}`}
								>
									{locale() === "ko" ? "이전" : "Previous"}
								</button>
								<Show
									when={currentStep() < 4}
									fallback={
										<button
											type="button"
											onClick={() => setShowConfirmModal(true)}
											disabled={!isStepValid(currentStep())}
											class="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{locale() === "ko" ? "채용 공고 게시" : "Post Job"}
										</button>
									}
								>
									<button
										type="button"
										onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
										disabled={!isStepValid(currentStep())}
										class="px-6 py-3 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{locale() === "ko" ? "다음" : "Next"}
									</button>
								</Show>
							</div>
						</div>
					</Show>

					{/* Preview Modal */}
					<Show when={showPreview()}>
						<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
							<div class="flex justify-between items-center mb-6">
								<h2 class="text-2xl font-bold text-white">
									{locale() === "ko" ? "공고 미리보기" : "Job Preview"}
								</h2>
								<button
									type="button"
									onClick={() => setShowPreview(false)}
									class="text-gray-400 hover:text-white"
								>
									<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>

							{/* Preview Content - Similar to Job Detail Page */}
							<div class="space-y-6">
								<div>
									<h1 class="text-3xl font-bold text-white mb-2">{jobForm().title}</h1>
									<div class="flex flex-wrap items-center gap-3 text-gray-400">
										<span class="text-lg font-medium text-gray-300">{jobForm().company}</span>
										<span>•</span>
										<span>{jobForm().location}</span>
										<span>•</span>
										<span>{jobForm().type}</span>
										<span>•</span>
										<span>{jobForm().experience}</span>
									</div>
								</div>

								<div class="flex items-center gap-6">
									<div>
										<p class="text-gray-400 text-sm mb-1">{locale() === "ko" ? "연봉" : "Salary"}</p>
										<p class="text-white font-medium">{jobForm().salary}</p>
									</div>
									<div>
										<p class="text-gray-400 text-sm mb-1">{locale() === "ko" ? "채용 바운티" : "Hiring Bounty"}</p>
										<p class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
											{jobForm().bountyAmount} USDC
										</p>
									</div>
								</div>

								<div>
									<h3 class="text-xl font-bold text-white mb-3">
										{locale() === "ko" ? "업무 소개" : "Job Description"}
									</h3>
									<p class="text-gray-400">{jobForm().description}</p>
								</div>

								{/* Add more preview sections as needed */}
							</div>

							<button
								type="button"
								onClick={() => setShowPreview(false)}
								class="mt-8 px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
							>
								{locale() === "ko" ? "닫기" : "Close Preview"}
							</button>
						</div>
					</Show>

					{/* Confirmation Modal */}
					<Show when={showConfirmModal()}>
						<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
							<div class="bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full">
								<h3 class="text-xl font-bold text-white mb-4">
									{locale() === "ko" ? "채용 공고 게시 확인" : "Confirm Job Posting"}
								</h3>
								<div class="bg-gray-800 rounded-lg p-4 mb-4">
									<p class="text-gray-400 text-sm mb-2">
										{locale() === "ko" ? "결제 내역" : "Payment Summary"}
									</p>
									<div class="space-y-2">
										<div class="flex justify-between">
											<span class="text-gray-400">{locale() === "ko" ? "바운티" : "Bounty"}</span>
											<span class="text-white">{calculateFees().bounty} USDC</span>
										</div>
										<div class="flex justify-between">
											<span class="text-gray-400">{locale() === "ko" ? "수수료" : "Fee"}</span>
											<span class="text-white">{calculateFees().platformFee} USDC</span>
										</div>
										<div class="flex justify-between pt-2 border-t border-gray-700">
											<span class="text-white font-medium">{locale() === "ko" ? "총액" : "Total"}</span>
											<span class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
												{calculateFees().total} USDC
											</span>
										</div>
									</div>
								</div>
								<p class="text-gray-400 text-sm mb-6">
									{locale() === "ko"
										? "위 금액이 지갑에서 즉시 출금됩니다. 계속하시겠습니까?"
										: "This amount will be deducted from your wallet immediately. Continue?"}
								</p>
								<div class="flex gap-2">
									<button
										type="button"
										onClick={handleSubmit}
										disabled={isSubmitting()}
										class="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50"
									>
										{isSubmitting()
											? (locale() === "ko" ? "처리중..." : "Processing...")
											: (locale() === "ko" ? "확인 및 게시" : "Confirm & Post")}
									</button>
									<button
										type="button"
										onClick={() => setShowConfirmModal(false)}
										disabled={isSubmitting()}
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