import { A } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { useI18n } from "~/contexts/i18n";

export default function NotFound() {
	const { t } = useI18n();
	const [isVisible, setIsVisible] = createSignal(false);

	onMount(() => {
		setIsVisible(true);
	});

	return (
		<main class="min-h-[calc(100vh-64px)] bg-gradient-to-b from-gray-900 to-black">
			<section class="relative min-h-[calc(100vh-64px)] flex items-center justify-center">
				<div class="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-cyan-900/20" />

				<div class="container mx-auto px-4 relative">
					<div
						class={`text-center transition-all duration-1000 ${
							isVisible()
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-10"
						}`}
					>
						{/* Animated 404 Number */}
						<div class="relative mb-6">
							<div class="text-[120px] md:text-[180px] font-bold leading-none">
								<span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 animate-pulse">
									404
								</span>
							</div>

							{/* Decorative elements */}
							<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
							<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" />
						</div>

						{/* Error Message */}
						<div class="mb-8">
							<h1 class="text-2xl md:text-4xl font-bold text-white mb-3">
								{t("common.notFound")}
							</h1>
							<p class="text-base md:text-lg text-gray-400 max-w-xl mx-auto">
								{t("common.error")}
							</p>
						</div>

						{/* Action Buttons */}
						<div class="flex flex-col sm:flex-row gap-4 justify-center">
							<A
								href="/"
								class="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
							>
								<span class="relative z-10">{t("common.backHome")}</span>
								<div class="absolute inset-0 bg-gradient-to-r from-cyan-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
							</A>

							<A
								href="/jobs"
								class="px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl border-2 border-gray-700 transition-all hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
							>
								{t("nav.jobs")}
							</A>
						</div>

						{/* Decorative Grid */}
						<div class="absolute inset-0 -z-10">
							<div class="absolute h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
