import { A, useLocation } from "@solidjs/router";
import LanguageSwitcher from "~/components/ui/LanguageSwitcher";
import SolanaWalletButton from "~/components/ui/SolanaWalletButton";
import { useI18n } from "~/contexts/i18n";

export default function Nav() {
	const location = useLocation();
	const { t } = useI18n();
	const isActive = (path: string) => {
		return path === location.pathname;
	};

	return (
		<nav class="bg-black/80 backdrop-blur-lg border-b border-gray-800 relative z-50">
			<div class="container mx-auto px-4">
				<div class="flex items-center justify-between h-16">
					<div class="flex items-center gap-8">
						<A
							href="/"
							class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400"
						>
							CardPass
						</A>

						<ul class="hidden md:flex items-center gap-1">
							<li>
								<A
									href="/"
									class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
										isActive("/")
											? "bg-violet-600/20 text-violet-400"
											: "text-gray-300 hover:text-white hover:bg-gray-800"
									}`}
								>
									{t("nav.home")}
								</A>
							</li>
							<li>
								<A
									href="/profiles"
									class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
										isActive("/profiles")
											? "bg-violet-600/20 text-violet-400"
											: "text-gray-300 hover:text-white hover:bg-gray-800"
									}`}
								>
									{t("nav.profiles")}
								</A>
							</li>
							<li>
								<A
									href="/jobs"
									class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
										isActive("/jobs")
											? "bg-violet-600/20 text-violet-400"
											: "text-gray-300 hover:text-white hover:bg-gray-800"
									}`}
								>
									{t("nav.jobs")}
								</A>
							</li>
							<li>
								<A
									href="/resumes"
									class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
										isActive("/resumes")
											? "bg-violet-600/20 text-violet-400"
											: "text-gray-300 hover:text-white hover:bg-gray-800"
									}`}
								>
									{t("nav.resumes")}
								</A>
							</li>
							<li>
								<A
									href="/about"
									class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
										isActive("/about")
											? "bg-violet-600/20 text-violet-400"
											: "text-gray-300 hover:text-white hover:bg-gray-800"
									}`}
								>
									{t("nav.about")}
								</A>
							</li>
						</ul>
					</div>

					<div class="flex items-center gap-4">
						<LanguageSwitcher />
						<SolanaWalletButton />
					</div>
				</div>
			</div>
		</nav>
	);
}
