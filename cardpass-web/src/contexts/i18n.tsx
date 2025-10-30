import * as i18n from "@solid-primitives/i18n";
import {
	type Accessor,
	createContext,
	createMemo,
	createSignal,
	type ParentComponent,
	startTransition,
	useContext,
} from "solid-js";
import { dict as enDict } from "~/constants/i18n/en";
import { dict as koDict } from "~/constants/i18n/ko";

export type Locale = "en" | "ko";
export type RawDictionary = typeof enDict;
export type Dictionary = i18n.Flatten<RawDictionary>;

// Pre-flatten dictionaries for instant switching
const dictionaries = {
	en: i18n.flatten(enDict),
	ko: i18n.flatten(koDict),
};

interface I18nContextValue {
	locale: Accessor<Locale>;
	setLocale: (locale: Locale) => void;
	t: i18n.Translator<Dictionary>;
	dict: Accessor<Dictionary>;
}

const I18nContext = createContext<I18nContextValue>();

export const I18nProvider: ParentComponent = (props) => {
	const [locale, setLocale] = createSignal<Locale>("en");

	// Use memo for instant dictionary switching
	const dict = createMemo(() => dictionaries[locale()]);

	const t = i18n.translator(dict, i18n.resolveTemplate);

	// Wrap setLocale with transition for smooth updates
	const smoothSetLocale = (newLocale: Locale) => {
		startTransition(() => setLocale(newLocale));
	};

	const value: I18nContextValue = {
		locale,
		setLocale: smoothSetLocale,
		t,
		dict,
	};

	return (
		<I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>
	);
};

export function useI18n() {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error("useI18n must be used within an I18nProvider");
	}
	return context;
}
