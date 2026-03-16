"use client";

import { useState } from "react";

type Lang = "en" | "fr";

const content = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: March 2026",
    intro:
      "This privacy policy explains how this application handles your personal data. We are committed to full compliance with the General Data Protection Regulation (GDPR — EU 2016/679).",
    sections: [
      {
        heading: "Data Controller",
        body: [
          "Controller: Maël",
          "Contact: mael.app@proton.me",
          "For any question or request regarding your personal data, you may contact the controller at the above email.",
        ],
      },
      {
        heading: "Data We Collect",
        subsections: [
          {
            title: "CV data (your content)",
            points: [
              "The CV information you enter (name, work experience, education, skills, etc.) is stored exclusively in your browser's localStorage.",
              'It is only transmitted to our server when you click "Generate PDF", solely for the purpose of rendering your PDF.',
              "It is never stored, logged, or retained on the server. It is deleted from server memory immediately after your PDF is delivered.",
            ],
          },
          {
            title: "Profile photo (optional)",
            points: [
              "If you upload a profile photo, it is converted to a base64 string in your browser and temporarily held in memory during PDF generation.",
              "It is never written to disk and is deleted from server memory immediately after PDF delivery.",
            ],
          },
          {
            title: "Analytics (Vercel Analytics & Speed Insights)",
            points: [
              "This site uses Vercel Analytics and Vercel Speed Insights to measure traffic and performance.",
              "These tools collect: page views, navigation events, Web Vitals metrics (load time, etc.), approximate geographic region (country/city level, derived from IP — the IP itself is not stored), and User-Agent (browser/OS type).",
              "No cookies are set. No personal data is stored. No cross-site tracking is performed.",
              "Vercel Analytics is designed to be privacy-first and GDPR-compliant. See vercel.com/docs/analytics/privacy-policy.",
            ],
          },
          {
            title: "Network & infrastructure (Cloudflare)",
            points: [
              "DNS resolution and DDoS protection are provided by Cloudflare. Cloudflare may process your IP address and request metadata for security and routing purposes.",
              "Cloudflare acts as a data processor under its own Data Processing Addendum. See cloudflare.com/privacypolicy.",
            ],
          },
        ],
      },
      {
        heading: "Cookies & Local Storage",
        body: [
          "This site does not use cookies.",
          "Your CV data and settings are stored in your browser's localStorage solely for your convenience (so your data persists between sessions). This storage never leaves your device except when you explicitly generate a PDF.",
          "You can clear this data at any time through your browser settings.",
        ],
      },
      {
        heading: "Legal Basis for Processing",
        body: [
          "CV data: Legitimate interest and performance of a service you explicitly requested (GDPR Art. 6.1.b).",
          "Analytics: Legitimate interest in understanding aggregate usage patterns (GDPR Art. 6.1.f). No personal data is processed.",
        ],
      },
      {
        heading: "Data Retention",
        body: [
          "Server-side: zero retention. All CV data and generated PDFs are deleted from server memory immediately after download (or after a maximum of 5 minutes if not downloaded).",
          "Client-side: data remains in your browser's localStorage until you clear it manually.",
        ],
      },
      {
        heading: "Your Rights (GDPR)",
        body: [
          "You have the following rights regarding your personal data:",
          "• Right of access (Art. 15): request a copy of your data.",
          "• Right to rectification (Art. 16): correct inaccurate data.",
          "• Right to erasure (Art. 17): request deletion of your data.",
          "• Right to data portability (Art. 20): receive your data in a structured format.",
          "• Right to object (Art. 21): object to processing based on legitimate interests.",
          "To exercise these rights, contact: mael.app@proton.me. We will respond within 30 days.",
          "You may also lodge a complaint with your national supervisory authority. In France: Commission Nationale de l'Informatique et des Libertés (CNIL) — cnil.fr.",
        ],
      },
      {
        heading: "Data Transfers Outside the EU",
        body: [
          "Vercel and Cloudflare are US-based companies. Data transfers to the US are carried out under Standard Contractual Clauses (SCCs) as approved by the European Commission, ensuring an adequate level of protection.",
        ],
      },
      {
        heading: "Changes to This Policy",
        body: [
          "This policy may be updated from time to time. The date at the top of this page reflects the most recent revision.",
        ],
      },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    lastUpdated: "Dernière mise à jour : mars 2026",
    intro:
      "Cette politique de confidentialité explique comment cette application traite vos données personnelles. Nous nous engageons à respecter pleinement le Règlement Général sur la Protection des Données (RGPD — UE 2016/679).",
    sections: [
      {
        heading: "Responsable du traitement",
        body: [
          "Responsable : Maël",
          "Contact : mael.app@proton.me",
          "Pour toute question ou demande concernant vos données personnelles, vous pouvez contacter le responsable à l'adresse ci-dessus.",
        ],
      },
      {
        heading: "Données collectées",
        subsections: [
          {
            title: "Données de CV (votre contenu)",
            points: [
              "Les informations de CV que vous saisissez (nom, expériences professionnelles, formation, compétences, etc.) sont stockées exclusivement dans le localStorage de votre navigateur.",
              "Elles ne sont transmises à notre serveur que lorsque vous cliquez sur « Générer le PDF », uniquement pour produire votre PDF.",
              "Elles ne sont jamais stockées, enregistrées dans des logs, ni conservées sur le serveur. Elles sont supprimées de la mémoire serveur immédiatement après la livraison de votre PDF.",
            ],
          },
          {
            title: "Photo de profil (optionnelle)",
            points: [
              "Si vous téléchargez une photo de profil, elle est convertie en chaîne base64 dans votre navigateur et maintenue temporairement en mémoire pendant la génération du PDF.",
              "Elle n'est jamais écrite sur disque et est supprimée de la mémoire serveur immédiatement après la livraison du PDF.",
            ],
          },
          {
            title: "Analytiques (Vercel Analytics & Speed Insights)",
            points: [
              "Ce site utilise Vercel Analytics et Vercel Speed Insights pour mesurer le trafic et les performances.",
              "Ces outils collectent : les pages visitées, les événements de navigation, les métriques Web Vitals (temps de chargement, etc.), la région géographique approximative (pays/ville, dérivée de l'IP — l'IP elle-même n'est pas stockée), et le User-Agent (type de navigateur/OS).",
              "Aucun cookie n'est déposé. Aucune donnée personnelle n'est stockée. Aucun suivi cross-site n'est effectué.",
              "Vercel Analytics est conçu pour être respectueux de la vie privée et conforme au RGPD. Voir vercel.com/docs/analytics/privacy-policy.",
            ],
          },
          {
            title: "Réseau & infrastructure (Cloudflare)",
            points: [
              "La résolution DNS et la protection DDoS sont assurées par Cloudflare. Cloudflare peut traiter votre adresse IP et les métadonnées de requête à des fins de sécurité et de routage.",
              "Cloudflare agit en tant que sous-traitant dans le cadre de son propre Data Processing Addendum. Voir cloudflare.com/privacypolicy.",
            ],
          },
        ],
      },
      {
        heading: "Cookies et stockage local",
        body: [
          "Ce site n'utilise pas de cookies.",
          "Vos données de CV et paramètres sont stockés dans le localStorage de votre navigateur uniquement pour votre confort (afin que vos données persistent entre les sessions). Ces données ne quittent jamais votre appareil, sauf lorsque vous générez explicitement un PDF.",
          "Vous pouvez effacer ces données à tout moment via les paramètres de votre navigateur.",
        ],
      },
      {
        heading: "Base légale du traitement",
        body: [
          "Données de CV : intérêt légitime et exécution d'un service que vous avez explicitement demandé (RGPD Art. 6.1.b).",
          "Analytiques : intérêt légitime à comprendre les tendances d'utilisation agrégées (RGPD Art. 6.1.f). Aucune donnée personnelle n'est traitée.",
        ],
      },
      {
        heading: "Conservation des données",
        body: [
          "Côté serveur : aucune conservation. Toutes les données de CV et les PDFs générés sont supprimés de la mémoire serveur immédiatement après le téléchargement (ou au bout de 5 minutes maximum si non téléchargés).",
          "Côté client : les données restent dans le localStorage de votre navigateur jusqu'à ce que vous les effaciez manuellement.",
        ],
      },
      {
        heading: "Vos droits (RGPD)",
        body: [
          "Vous disposez des droits suivants concernant vos données personnelles :",
          "• Droit d'accès (Art. 15) : demander une copie de vos données.",
          "• Droit de rectification (Art. 16) : corriger des données inexactes.",
          "• Droit à l'effacement (Art. 17) : demander la suppression de vos données.",
          "• Droit à la portabilité (Art. 20) : recevoir vos données dans un format structuré.",
          "• Droit d'opposition (Art. 21) : s'opposer au traitement fondé sur l'intérêt légitime.",
          "Pour exercer ces droits, contactez : mael.app@proton.me. Nous répondrons dans un délai de 30 jours.",
          "Vous pouvez également introduire une réclamation auprès de votre autorité de contrôle nationale. En France : Commission Nationale de l'Informatique et des Libertés (CNIL) — cnil.fr.",
        ],
      },
      {
        heading: "Transferts de données hors UE",
        body: [
          "Vercel et Cloudflare sont des sociétés américaines. Les transferts de données vers les États-Unis sont effectués dans le cadre de Clauses Contractuelles Types (CCT) approuvées par la Commission européenne, garantissant un niveau de protection adéquat.",
        ],
      },
      {
        heading: "Modifications de cette politique",
        body: [
          "Cette politique peut être mise à jour de temps en temps. La date en haut de cette page reflète la révision la plus récente.",
        ],
      },
    ],
  },
};

type Section = (typeof content.en.sections)[number];

function renderSection(section: Section, lang: Lang) {
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
  const [lang, setLang] = useState<Lang>("en");
  const t = content[lang];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-2">
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

      <p className="text-xs text-muted-foreground mb-8">{t.lastUpdated}</p>

      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        {t.intro}
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        {t.sections.map((section) => renderSection(section, lang))}
      </div>
    </div>
  );
}
