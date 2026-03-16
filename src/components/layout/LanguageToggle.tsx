"use client";

import { useT } from "@/context/LanguageContext";
import { Lang } from "@/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES: { value: Lang; flag: string; label: string }[] = [
  { value: "en", flag: "🇬🇧", label: "English" },
  { value: "fr", flag: "🇫🇷", label: "Français" },
];

export function LanguageToggle() {
  const { lang, setLang } = useT();
  const current = LANGUAGES.find((l) => l.value === lang)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2 gap-1.5">
          <span>{current.flag}</span>
          <span className="text-sm">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(({ value, flag, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setLang(value)}
            className={lang === value ? "font-medium" : ""}
          >
            <span className="mr-2">{flag}</span>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
