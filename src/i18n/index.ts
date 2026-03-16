import en from "./en";
import fr from "./fr";

export type Lang = "en" | "fr";
export type Translations = typeof en;

export const translations: Record<Lang, Translations> = { en, fr };
