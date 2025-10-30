import { A } from "@solidjs/router";
import { createSignal, For, onMount } from "solid-js";
import { useI18n } from "~/contexts/i18n";

export default function Home() {
	const [isVisible, setIsVisible] = createSignal(false);
	const { t } = useI18n();

	onMount(() => {
		setIsVisible(true);
	});

	const features = () => [
		{
			title: t("home.features.contactGate.title"),
			icon: "🛡️",
			description: t("home.features.contactGate.description"),
			details: t("home.features.contactGate.details"),
		},
		{
			title: t("home.features.introRewards.title"),
			icon: "💰",
			description: t("home.features.introRewards.description"),
			details: t("home.features.introRewards.details"),
		},
		{
			title: t("home.features.digitalCards.title"),
			icon: "🎴",
			description: t("home.features.digitalCards.description"),
			details: t("home.features.digitalCards.details"),
		},
	];

	const userTypes = () => [
		{
			title: t("home.userTypes.professionals.title"),
			benefits: t(
				"home.userTypes.professionals.benefits",
			) as unknown as string[],
		},
		{
			title: t("home.userTypes.recruiters.title"),
			benefits: t("home.userTypes.recruiters.benefits") as unknown as string[],
		},
		{
			title: t("home.userTypes.referrers.title"),
			benefits: t("home.userTypes.referrers.benefits") as unknown as string[],
		},
	];

	const steps = () => [
		{
			number: "1",
			title: t("home.howItWorks.steps.0.title"),
			description: t("home.howItWorks.steps.0.description"),
		},
		{
			number: "2",
			title: t("home.howItWorks.steps.1.title"),
			description: t("home.howItWorks.steps.1.description"),
		},
		{
			number: "3",
			title: t("home.howItWorks.steps.2.title"),
			description: t("home.howItWorks.steps.2.description"),
		},
	];

	return (
		<main class="min-h-screen bg-gradient-to-b from-gray-900 to-black">
			{/* Hero Section */}
			<section class="relative overflow-hidden">
				<div class="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-cyan-900/20" />
				<div class="container mx-auto px-4 py-20 relative">
					<div
						class={`text-center transition-all duration-1000 ${
							isVisible()
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-10"
						}`}
					>
						<div class="inline-flex items-center gap-2 px-4 py-2 bg-violet-900/30 text-violet-300 rounded-full text-sm font-medium mb-8 border border-violet-800/50">
							<span class="relative flex h-2 w-2">
								<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75" />
								<span class="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
							</span>
							{t("home.subtitle")}
						</div>

						<h1 class="text-5xl md:text-7xl font-bold text-white mb-6">
							{t("home.title")}
						</h1>

						<p class="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
							{t("home.description")}
						</p>

						<div class="flex flex-col sm:flex-row gap-4 justify-center">
							<button
								type="button"
								class="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
							>
								<span class="relative z-10">{t("home.cta")}</span>
								<div class="absolute inset-0 bg-gradient-to-r from-cyan-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
							</button>
							<A
								href="/jobs"
								class="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl border-2 border-gray-700 transition-all hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
							>
								{t("home.browseJobs")}
							</A>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section class="py-20 bg-gray-900">
				<div class="container mx-auto px-4">
					<div class="text-center mb-16">
						<h2 class="text-4xl font-bold text-white mb-4">
							{t("home.features.title")}
						</h2>
						<p class="text-lg text-gray-400">{t("home.features.subtitle")}</p>
					</div>

					<div class="grid md:grid-cols-3 gap-8">
						<For each={features()}>
							{(feature, index) => (
								<div
									class={`group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 hover:border-violet-500 hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-300 transform hover:-translate-y-2`}
									style={{ "animation-delay": `${index() * 100}ms` }}
								>
									<div class="text-5xl mb-4">{feature.icon}</div>
									<h3 class="text-2xl font-bold text-white mb-3">
										{feature.title}
									</h3>
									<p class="text-gray-300 font-medium mb-2">
										{feature.description}
									</p>
									<p class="text-gray-500 text-sm">{feature.details}</p>
								</div>
							)}
						</For>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section class="py-20 bg-gradient-to-b from-black to-gray-900">
				<div class="container mx-auto px-4">
					<div class="text-center mb-16">
						<h2 class="text-4xl font-bold text-white mb-4">
							{t("home.howItWorks.title")}
						</h2>
						<p class="text-lg text-gray-400">{t("home.howItWorks.subtitle")}</p>
					</div>

					<div class="max-w-4xl mx-auto">
						<div class="relative">
							<div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 to-cyan-500" />
							<For each={steps()}>
								{(step, _index) => (
									<div class="relative flex items-start mb-12 group">
										<div class="flex-shrink-0 w-16 h-16 bg-gray-900 rounded-full border-4 border-violet-500 flex items-center justify-center font-bold text-xl text-violet-400 group-hover:scale-110 transition-transform">
											{step.number}
										</div>
										<div class="ml-8 flex-1">
											<h3 class="text-2xl font-bold text-white mb-2">
												{step.title}
											</h3>
											<p class="text-gray-400">{step.description}</p>
										</div>
									</div>
								)}
							</For>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits for Different Users */}
			<section class="py-20 bg-gray-900">
				<div class="container mx-auto px-4">
					<div class="text-center mb-16">
						<h2 class="text-4xl font-bold text-white mb-4">
							{t("home.userTypes.title")}
						</h2>
						<p class="text-lg text-gray-400">{t("home.userTypes.subtitle")}</p>
					</div>

					<div class="grid md:grid-cols-3 gap-8">
						<For each={userTypes()}>
							{(type) => (
								<div class="bg-gradient-to-br from-violet-900/20 to-cyan-900/20 p-8 rounded-2xl border border-gray-800 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all">
									<h3 class="text-2xl font-bold text-white mb-6">
										{type.title}
									</h3>
									<ul class="space-y-4">
										<For each={type.benefits}>
											{(benefit) => (
												<li class="flex items-start">
													<svg
														class="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														role="img"
														aria-label="Check mark"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M5 13l4 4L19 7"
														/>
													</svg>
													<span class="text-gray-300">{benefit}</span>
												</li>
											)}
										</For>
									</ul>
								</div>
							)}
						</For>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section class="py-20 bg-gradient-to-r from-violet-600 to-cyan-600">
				<div class="container mx-auto px-4 text-center">
					<h2 class="text-4xl font-bold text-white mb-6">
						{t("home.cta2.title")}
					</h2>
					<p class="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
						{t("home.cta2.subtitle")}
					</p>
					<button
						type="button"
						class="group relative px-10 py-5 bg-white text-gray-900 font-bold text-lg rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
					>
						<span class="relative z-10">{t("home.cta2.button")}</span>
						<div class="absolute inset-0 bg-gradient-to-r from-violet-100 to-cyan-100 opacity-0 group-hover:opacity-100 transition-opacity" />
					</button>
					<p class="mt-6 text-white/80 text-sm">{t("home.cta2.note")}</p>
				</div>
			</section>

			{/* Footer */}
			<footer class="py-12 bg-gray-900">
				<div class="container mx-auto px-4">
					<div class="flex flex-col md:flex-row justify-between items-center">
						<div class="text-white mb-4 md:mb-0">
							<h3 class="text-2xl font-bold mb-2">CardPass</h3>
							<p class="text-gray-400">{t("home.footer.tagline")}</p>
						</div>
						<div class="flex gap-6">
							<button
								type="button"
								class="text-gray-400 hover:text-white transition-colors"
								onClick={() => console.log("Navigate to docs")}
							>
								{t("home.footer.links.docs")}
							</button>
							<button
								type="button"
								class="text-gray-400 hover:text-white transition-colors"
								onClick={() => console.log("Navigate to GitHub")}
							>
								{t("home.footer.links.github")}
							</button>
							<button
								type="button"
								class="text-gray-400 hover:text-white transition-colors"
								onClick={() => console.log("Navigate to Discord")}
							>
								{t("home.footer.links.discord")}
							</button>
							<button
								type="button"
								class="text-gray-400 hover:text-white transition-colors"
								onClick={() => console.log("Navigate to Twitter")}
							>
								{t("home.footer.links.twitter")}
							</button>
						</div>
					</div>
					<div class="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
						{t("home.footer.copyright")}
					</div>
				</div>
			</footer>
		</main>
	);
}
