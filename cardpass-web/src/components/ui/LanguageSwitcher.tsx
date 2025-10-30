import { type Component, createSignal, For, Show } from "solid-js";
import { useI18n } from "~/contexts/i18n";

// Custom language icon to avoid SSR issues
const LanguageIcon: Component<{ size?: number }> = (props) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={props.size || 24}
			height={props.size || 24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="icon icon-tabler icons-tabler-outline icon-tabler-language"
			role="img"
			aria-label="Language icon"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M4 5h7" />
			<path d="M9 3v2c0 4.418 -2.239 8 -5 8" />
			<path d="M5 9c0 2.144 2.952 3.908 6.7 4" />
			<path d="M12 20l4 -9l4 9" />
			<path d="M19.1 18h-6.2" />
		</svg>
	);
};

const LanguageSwitcher: Component = () => {
	const { locale, setLocale } = useI18n();
	const [isOpen, setIsOpen] = createSignal(false);

	const languages = [
		{ code: "en", label: "English", flag: "🇺🇸" },
		{ code: "ko", label: "한국어", flag: "🇰🇷" },
	];

	const _currentLanguage = () =>
		languages.find((lang) => lang.code === locale());

	const handleLanguageChange = (langCode: "en" | "ko") => {
		setLocale(langCode);
		setIsOpen(false);
	};

	return (
		<>
			{/* Click outside to close - moved before the button */}
			<Show when={isOpen()}>
				<button
					type="button"
					class="fixed inset-0 z-[90] bg-transparent border-none cursor-default"
					onClick={() => setIsOpen(false)}
					aria-label="Close language menu"
				/>
			</Show>

			<div class="relative z-[100]">
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen())}
					class="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
					aria-label="Select language"
				>
					<LanguageIcon size={20} />
				</button>

				<Show when={isOpen()}>
					<div class="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-[100]">
						<For each={languages}>
							{(lang) => (
								<button
									type="button"
									onClick={() => handleLanguageChange(lang.code as "en" | "ko")}
									class={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-800 transition-colors first:rounded-t-lg last:rounded-b-lg ${
										locale() === lang.code
											? "bg-violet-600/20 text-violet-400"
											: "text-gray-300"
									}`}
								>
									<span class="text-lg">{lang.flag}</span>
									<span class="text-sm font-medium">{lang.label}</span>
								</button>
							)}
						</For>
					</div>
				</Show>
			</div>
		</>
	);
};

export default LanguageSwitcher;
