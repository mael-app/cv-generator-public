const fr = {
  nav: {
    brand: "CV Generator",
  },

  editor: {
    title: "Éditeur de CV",

    header: {
      title: "Informations personnelles",
      name: { label: "Nom complet", placeholder: "Jean Dupont" },
      jobTitle: { label: "Titre du poste", placeholder: "Ingénieur logiciel" },
      jobSearchGoal: {
        label: "Objectif de recherche",
        placeholder: "À la recherche de...",
      },
      age: { label: "Âge", placeholder: "25 ans" },
      contact: {
        heading: "Contact",
        email: { label: "Email", placeholder: "jean@exemple.fr" },
        phone: { label: "Téléphone", placeholder: "+33 6 12 34 56 78" },
        location: { label: "Localisation", placeholder: "Paris, France" },
        linkedin: {
          label: "LinkedIn",
          placeholder: "linkedin.com/in/jeandupont",
        },
        github: { label: "GitHub", placeholder: "github.com/jeandupont" },
      },
    },

    experiences: {
      title: "Expériences professionnelles",
      add: "Ajouter",
      empty: "Aucune expérience",
      role: "Poste",
      company: "Entreprise",
      date: { label: "Dates", placeholder: "Jan 2023 – Présent" },
      description: "Description",
      tasks: {
        label: "Tâches",
        add: "Ajouter une tâche",
        placeholder: "Description de la tâche...",
      },
    },

    education: {
      title: "Formation",
      add: "Ajouter",
      empty: "Aucune formation",
      degree: "Diplôme",
      school: "École",
      date: { label: "Dates", placeholder: "2020 – 2023" },
      details: "Détails",
    },

    projects: {
      title: "Projets",
      add: "Ajouter",
      empty: "Aucun projet",
      title_: "Titre",
      stack: { label: "Stack", placeholder: "React, Node.js, PostgreSQL" },
      description: "Description",
    },

    skills: {
      title: "Compétences techniques",
      placeholder: "React, TypeScript...",
    },

    softSkills: {
      title: "Soft Skills",
      placeholder: "Leadership, Communication...",
    },

    languages: {
      title: "Langues",
      add: "Ajouter",
      empty: "Aucune langue",
      name: { label: "Langue", placeholder: "Français" },
      level: { label: "Niveau", placeholder: "Natif, C1..." },
    },

    photo: {
      upload: "Importer une photo",
      change: "Changer la photo",
      hint: "JPEG, PNG ou GIF — max 5 Mo",
      alt: "Photo de profil",
      tooLarge: "La photo doit faire moins de 5 Mo",
      invalidType: "Veuillez sélectionner un fichier image",
    },
  },

  generation: {
    title: "Paramètres de génération",
    domain: {
      label: "Domaine de l'entreprise",
      placeholder: "apple.com",
      hint: "Utilisé pour l'extraction de la couleur de marque",
    },
    colorOverride: { label: "Couleur personnalisée", placeholder: "#005eb8" },
    activeColor: "Couleur active",
    theme: { label: "Thème PDF", light: "Clair", dark: "Sombre" },
    cvLanguage: {
      label: "Langue du CV",
      auto: "Auto (suit le dashboard)",
      options: [
        { value: "fr", flag: "🇫🇷", label: "Français" },
        { value: "en", flag: "🇬🇧", label: "English" },
      ],
    },
    detecting: "Détection...",
    preview: "Aperçu",
    previewLoading: "Chargement...",
    previewTitle: "Aperçu",
    generate: "Générer le PDF",
    generating: "Génération en cours...",
    downloaded: "Téléchargé !",
    error: "Erreur",
    previewError: "Échec de l'aperçu",
    generateError: "Échec de la génération",
  },

  importExport: {
    import: {
      button: "Importer JSON",
      title: "Importer un CV",
      pasteLabel: "Collez votre JSON ci-dessous",
      placeholder: '{ "header": { "name": "Jean Dupont", ... } }',
      fromFile: "Importer depuis un fichier",
      submit: "Importer",
      errorSyntax: "Syntaxe JSON invalide",
    },
    export: "Exporter JSON",
    clear: {
      button: "Effacer",
      title: "Effacer tous les champs ?",
      description:
        "Cela réinitialisera le CV complet et tous les paramètres. Cette action est irréversible.",
      cancel: "Annuler",
      confirm: "Tout effacer",
    },
  },

  api: {
    button: "API",
    title: "Utilisation de l'API",
    description: "Générez des CVs par HTTP — aucune authentification requise.",
    parameters: "Paramètres",
    params: {
      cv: "Fichier JSON correspondant au schéma CV — requis",
      photo: "Photo de profil (JPEG / PNG / GIF, max 5 Mo) — optionnel",
      domain:
        "Domaine de l'entreprise pour l'extraction de couleur (ex. apple.com) — optionnel",
      color:
        "Couleur hexadécimale, prioritaire sur le domaine (ex. #005eb8) — optionnel",
      theme: "light ou dark — défaut : light",
    },
    response: "Réponse",
    responseDesc:
      "Retourne le PDF directement en application/pdf. En cas d'erreur, retourne du JSON avec un champ error.",
  },

  legal: {
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

  privacy: {
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

  footer: {
    madeBy: "Fait par",
    with: "avec",
    sourceCode: "Code source",
    privacy: "Confidentialité",
    legal: "Mentions légales",
  },
};

export default fr;
