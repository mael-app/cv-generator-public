"use client";

import { useT } from "@/context/LanguageContext";
import { Translations } from "@/i18n";

type Section = Translations["privacy"]["sections"][number];

function renderSection(section: Section) {
  if ("subsections" in section && section.subsections) {
    return (
      <section key={section.heading}>
        <h2 className="text-base font-semibold mb-3">{section.heading}</h2>
        <div className="space-y-4">
          {section.subsections.map((sub) => (
            <div key={sub.title}>
              <h3 className="text-sm font-medium mb-1">{sub.title}</h3>
              <ul className="space-y-1 text-muted-foreground">
                {sub.points.map((point, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if ("body" in section && section.body) {
    return (
      <section key={section.heading}>
        <h2 className="text-base font-semibold mb-2">{section.heading}</h2>
        <div className="space-y-1 text-muted-foreground">
          {section.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>
    );
  }

  return null;
}

export default function PrivacyPage() {
  const { t } = useT();
  const tp = t.privacy;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">{tp.title}</h1>
      <p className="text-xs text-muted-foreground mb-8">{tp.lastUpdated}</p>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        {tp.intro}
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        {tp.sections.map((section) => renderSection(section))}
      </div>
    </div>
  );
}
