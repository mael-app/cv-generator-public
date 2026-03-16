const en = {
  nav: {
    brand: "CV Generator",
  },

  editor: {
    title: "CV Editor",

    header: {
      title: "Personal Information",
      name: { label: "Full Name", placeholder: "John Doe" },
      jobTitle: { label: "Job Title", placeholder: "Software Engineer" },
      jobSearchGoal: {
        label: "Job Search Goal",
        placeholder: "Looking for...",
      },
      age: { label: "Age", placeholder: "25 years old" },
      contact: {
        heading: "Contact",
        email: { label: "Email", placeholder: "john@example.com" },
        phone: { label: "Phone", placeholder: "+33 6 12 34 56 78" },
        location: { label: "Location", placeholder: "Paris, France" },
        linkedin: { label: "LinkedIn", placeholder: "linkedin.com/in/johndoe" },
        github: { label: "GitHub", placeholder: "github.com/johndoe" },
      },
    },

    experiences: {
      title: "Work Experience",
      add: "Add",
      empty: "No experiences yet",
      role: "Role",
      company: "Company",
      date: { label: "Date", placeholder: "Jan 2023 – Present" },
      description: "Description",
      tasks: {
        label: "Tasks",
        add: "Add task",
        placeholder: "Task description...",
      },
    },

    education: {
      title: "Education",
      add: "Add",
      empty: "No education yet",
      degree: "Degree",
      school: "School",
      date: { label: "Date", placeholder: "2020 – 2023" },
      details: "Details",
    },

    projects: {
      title: "Projects",
      add: "Add",
      empty: "No projects yet",
      title_: "Title",
      stack: { label: "Stack", placeholder: "React, Node.js, PostgreSQL" },
      description: "Description",
    },

    skills: {
      title: "Hard Skills",
      placeholder: "React, TypeScript...",
    },

    softSkills: {
      title: "Soft Skills",
      placeholder: "Leadership, Communication...",
    },

    languages: {
      title: "Languages",
      add: "Add",
      empty: "No languages yet",
      name: { label: "Language", placeholder: "English" },
      level: { label: "Level", placeholder: "Native, C1..." },
    },

    photo: {
      upload: "Upload Photo",
      change: "Change Photo",
      hint: "JPEG, PNG or GIF — max 5MB",
      alt: "Profile photo",
      tooLarge: "Photo must be under 5MB",
      invalidType: "Please select an image file",
    },
  },

  generation: {
    title: "Generation Settings",
    domain: {
      label: "Company Domain",
      placeholder: "apple.com",
      hint: "Used for brand color extraction",
    },
    colorOverride: { label: "Color override", placeholder: "#005eb8" },
    activeColor: "Active Color",
    theme: { label: "PDF Theme", light: "Light", dark: "Dark" },
    cvLanguage: {
      label: "CV Language",
      auto: "Auto (follows dashboard)",
      options: [
        { value: "fr", flag: "🇫🇷", label: "Français" },
        { value: "en", flag: "🇬🇧", label: "English" },
      ],
    },
    detecting: "Detecting...",
    preview: "Preview",
    previewLoading: "Loading preview...",
    previewTitle: "Preview",
    generate: "Generate PDF",
    generating: "Generating PDF...",
    downloaded: "Downloaded!",
    error: "Error",
    previewError: "Preview failed",
    generateError: "Generation failed",
  },

  importExport: {
    import: {
      button: "Import JSON",
      title: "Import CV",
      pasteLabel: "Paste your JSON below",
      placeholder: '{ "header": { "name": "John Doe", ... } }',
      fromFile: "Import from file",
      submit: "Import",
      errorSyntax: "Invalid JSON syntax",
    },
    export: "Export JSON",
    clear: {
      button: "Clear",
      title: "Clear all fields?",
      description:
        "This will reset the entire CV and all generation settings. This cannot be undone.",
      cancel: "Cancel",
      confirm: "Clear all",
    },
  },

  api: {
    button: "API",
    title: "API Usage",
    description: "Generate CVs programmatically via HTTP — no auth required.",
    parameters: "Parameters",
    params: {
      cv: "JSON file matching the CV schema — required",
      photo: "Profile photo (JPEG / PNG / GIF, max 5 MB) — optional",
      domain:
        "Company domain for brand color extraction (e.g. apple.com) — optional",
      color:
        "Hex color override, takes precedence over domain (e.g. #005eb8) — optional",
      theme: "light or dark — default: light",
    },
    response: "Response",
    responseDesc:
      "Returns the PDF binary directly as application/pdf. On error, returns JSON with an error field.",
  },

  legal: {
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

  privacy: {
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

  footer: {
    madeBy: "Made by",
    with: "with",
    sourceCode: "Source code",
    privacy: "Privacy",
    legal: "Legal",
  },
};

export default en;
