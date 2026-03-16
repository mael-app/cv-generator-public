"use client";

import { useState } from "react";

type Lang = "en" | "fr";

const content = {
  en: {
    title: "Legal Notice",
    sections: [
      {
        heading: "Publisher",
        body: [
          "This website is published by Maël, acting as an individual.",
          "Contact: mael.app@proton.me",
        ],
      },
      {
        heading: "Hosting",
        body: [
          "This website is hosted by Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA.",
          "Website: vercel.com",
        ],
      },
      {
        heading: "DNS & Network",
        body: [
          "Domain name services and network protection are provided by Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA.",
          "Website: cloudflare.com",
        ],
      },
      {
        heading: "Intellectual Property",
        body: [
          "The source code of this application is open source and available on GitHub under its respective license.",
          "The CV data you enter belongs entirely to you. No content is stored or claimed by this service.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "This service is provided as-is, without any warranty of any kind. The publisher cannot be held liable for any direct or indirect damages arising from its use.",
          "PDF generation is performed server-side and all data is discarded immediately after download.",
        ],
      },
    ],
  },
  fr: {
    title: "Mentions légales",
    sections: [
      {
        heading: "Éditeur",
        body: [
          "Ce site est édité par Maël, agissant en tant que particulier.",
          "Contact : mael.app@proton.me",
        ],
      },
      {
        heading: "Hébergement",
        body: [
          "Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.",
          "Site web : vercel.com",
        ],
      },
      {
        heading: "DNS & Réseau",
        body: [
          "Les services de nom de domaine et la protection réseau sont fournis par Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis.",
          "Site web : cloudflare.com",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        body: [
          "Le code source de cette application est open source et disponible sur GitHub sous sa licence respective.",
          "Les données de CV que vous saisissez vous appartiennent entièrement. Aucun contenu n'est conservé ni revendiqué par ce service.",
        ],
      },
      {
        heading: "Responsabilité",
        body: [
          "Ce service est fourni tel quel, sans garantie d'aucune sorte. L'éditeur ne saurait être tenu responsable de tout dommage direct ou indirect découlant de son utilisation.",
          "La génération du PDF est effectuée côté serveur et toutes les données sont supprimées immédiatement après le téléchargement.",
        ],
      },
    ],
  },
};

export default function LegalPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = content[lang];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <button
          onClick={() => setLang(lang === "en" ? "fr" : "en")}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
          aria-label="Switch language"
        >
          {lang === "en" ? (
            <>
              <span>🇫🇷</span>
              <span>Français</span>
            </>
          ) : (
            <>
              <span>🇬🇧</span>
              <span>English</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        {t.sections.map((section) => (
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
