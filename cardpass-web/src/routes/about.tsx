import { useI18n } from "~/contexts/i18n";

export default function About() {
	const { t } = useI18n();

	return (
		<main class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
			<div class="container mx-auto px-4 py-20">
				<h1 class="text-5xl font-bold text-center mb-4">{t("about.title")}</h1>
				<p class="text-xl text-gray-300 text-center mb-16">
					{t("about.description")}
				</p>

				<div class="grid md:grid-cols-1 gap-12 max-w-4xl mx-auto">
					<section class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
						<h2 class="text-3xl font-bold mb-4 text-violet-400">
							{t("about.mission.title")}
						</h2>
						<p class="text-gray-300 leading-relaxed">
							{t("about.mission.content")}
						</p>
					</section>

					<section class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
						<h2 class="text-3xl font-bold mb-4 text-cyan-400">
							{t("about.technology.title")}
						</h2>
						<p class="text-gray-300 leading-relaxed">
							{t("about.technology.content")}
						</p>
					</section>

					<section class="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
						<h2 class="text-3xl font-bold mb-4 text-violet-400">
							{t("about.contact.title")}
						</h2>
						<p class="text-gray-300">{t("about.contact.email")}</p>
						<p class="text-gray-300">{t("about.contact.twitter")}</p>
					</section>
				</div>
			</div>
		</main>
	);
}
