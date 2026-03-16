"use client";

import { useT } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useT();

  return (
    <footer className="border-t mt-12 py-4 text-center text-sm text-muted-foreground">
      {t.footer.madeBy}{" "}
      <a
        href="https://github.com/mael-app"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground hover:underline"
      >
        Maël
      </a>{" "}
      {t.footer.with} ❤️ —{" "}
      <a
        href="https://github.com/mael-app/cv-generator-public"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground hover:underline"
      >
        {t.footer.sourceCode}
      </a>
      <span className="mx-2 text-muted-foreground/40">·</span>
      <a
        href="/privacy"
        className="hover:text-foreground hover:underline transition-colors"
      >
        {t.footer.privacy}
      </a>
      <span className="mx-2 text-muted-foreground/40">·</span>
      <a
        href="/legal"
        className="hover:text-foreground hover:underline transition-colors"
      >
        {t.footer.legal}
      </a>
    </footer>
  );
}
