"use client";

import { createContext, useContext, useState } from "react";
import { Lang, Translations, translations } from "@/i18n";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

interface Props {
  children: React.ReactNode;
  defaultLang: Lang;
}

export function LanguageProvider({ children, defaultLang }: Props) {
  const [lang, setLangState] = useState<Lang>(defaultLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  return useContext(LanguageContext);
}
