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

interface RenderOptions {
  cv: CVData;
  photoBase64?: string;
  color: string;
  theme: "light" | "dark";
  cvLanguage?: CVLanguage;
  inlineFonts?: boolean;
}

export async function renderCV({
  cv,
  photoBase64,
  color,
  theme,
  cvLanguage = "fr",
  inlineFonts = true,
}: RenderOptions): Promise<string> {
  // Format Links
  const linkedinUrl = cv.header.contact.linkedin.startsWith("http")
    ? cv.header.contact.linkedin
    : `https://${cv.header.contact.linkedin}`;
  const githubUrl = cv.header.contact.github.startsWith("http")
    ? cv.header.contact.github
    : `https://${cv.header.contact.github}`;

  let linkedinLabel = cv.header.contact.linkedin
    .replace(/(https?:\/\/)?(www\.)?linkedin\.com\/in\//, "")
    .replace(/\/$/, "");
  linkedinLabel = linkedinLabel.split("-").slice(0, 2).join("-");

  let githubLabel = cv.header.contact.github
    .replace(/(https?:\/\/)?(www\.)?github\.com\//, "")
    .replace(/\/$/, "");
  githubLabel = `@${githubLabel}`;

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

  const templatePath = path.join(process.cwd(), "src/views/cv.ejs");
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
