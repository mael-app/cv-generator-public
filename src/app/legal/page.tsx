"use client";

import { useT } from "@/context/LanguageContext";

export default function LegalPage() {
  const { t } = useT();
  const tl = t.legal;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">{tl.title}</h1>

      <div className="space-y-8 text-sm leading-relaxed">
        {tl.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-base font-semibold mb-2">{section.heading}</h2>
            <div className="space-y-1 text-muted-foreground">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
