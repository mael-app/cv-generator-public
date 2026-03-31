import ejs from "ejs";
import path from "path";
import { CVData } from "@/lib/schemas/cv.schema";
import { getInlinedFontStyle } from "./font-inliner";
import logger from "@/lib/logger";

export type CVLanguage = "fr" | "en";

const CV_LABELS: Record<CVLanguage, Record<string, string>> = {
  fr: {
    experiences: "Expérience Professionnelle",
    projects: "Projets Significatifs",
    education: "Formation",
    hardSkills: "Hard Skills",
    softSkills: "Soft Skills",
    languages: "Langues",
  },
  en: {
    experiences: "Work Experience",
    projects: "Significant Projects",
    education: "Education",
    hardSkills: "Hard Skills",
    softSkills: "Soft Skills",
    languages: "Languages",
  },
};

export type CvTemplate = "modern" | "classic" | "simple";

interface RenderOptions {
  cv: CVData;
  photoBase64?: string;
  color: string;
  theme: "light" | "dark";
  cvLanguage?: CVLanguage;
  inlineFonts?: boolean;
  cvTemplate?: CvTemplate;
}

export async function renderCV({
  cv,
  photoBase64,
  color,
  theme,
  cvLanguage = "fr",
  inlineFonts = true,
  cvTemplate = "modern",
}: RenderOptions): Promise<string> {
  // Format Links — produce empty strings for missing values so the
  // template can use a simple truthiness check to hide the item.
  const rawLinkedin = cv.header.contact.linkedin.trim();
  const linkedinUrl = rawLinkedin
    ? rawLinkedin.startsWith("http")
      ? rawLinkedin
      : `https://${rawLinkedin}`
    : "";
  const linkedinLabel = rawLinkedin
    ? rawLinkedin
        .replace(/(https?:\/\/)?(www\.)?linkedin\.com\/in\//, "")
        .replace(/\/$/, "")
        .split("-")
        .slice(0, 2)
        .join("-")
    : "";

  const rawGithub = cv.header.contact.github.trim();
  const githubUrl = rawGithub
    ? rawGithub.startsWith("http")
      ? rawGithub
      : `https://${rawGithub}`
    : "";
  const githubLabel = rawGithub
    ? `@${rawGithub.replace(/(https?:\/\/)?(www\.)?github\.com\//, "").replace(/\/$/, "")}`
    : "";

  const mainColor = `#${color.replace("#", "")}`;

  const labels = CV_LABELS[cvLanguage];

  const viewData = {
    ...cv,
    labels,
    header: {
      ...cv.header,
      pictureBase64: photoBase64 || null,
      contact: {
        ...cv.header.contact,
        linkedinUrl,
        linkedinLabel,
        githubUrl,
        githubLabel,
      },
    },
    mainColor,
    theme,
  };

  let cvTemplateFile: string;
  switch (cvTemplate) {
    case "classic":
      cvTemplateFile = "classic.ejs";
      break;
    case "simple":
      cvTemplateFile = "simple.ejs";
      break;
    case "modern":
    default:
      cvTemplateFile = "modern.ejs";
      break;
  }

  const templatePath = path.join(process.cwd(), `src/views/${cvTemplateFile}`);
  let htmlContent = (await ejs.renderFile(templatePath, viewData)) as string;

  // Replace Google Fonts <link> with inlined @font-face (woff2 as base64)
  // so Puppeteer can render fonts without network access
  if (!inlineFonts) return htmlContent;

  try {
    const fontStyle = await getInlinedFontStyle();
    const replaced = htmlContent.replace(
      /<link\s[^>]*fonts\.googleapis\.com[^>]*>/,
      fontStyle,
    );
    if (replaced === htmlContent) {
      logger.warn(
        "Font <link> tag not found in template — fonts may not render",
      );
    } else {
      logger.debug("Google Fonts inlined successfully");
      htmlContent = replaced;
    }
  } catch (err) {
    logger.error(
      { err },
      "Font inlining failed — PDF will render without custom fonts",
    );
  }

  return htmlContent;
}
