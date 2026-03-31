import { CVSchema, CVData } from "@/lib/schemas/cv.schema";
import { ColorService } from "@/lib/color/color.service";
import { renderCV, CVLanguage, CvTemplate } from "@/lib/pdf/renderer";
import { MAX_PHOTO_SIZE } from "@/lib/cv/constants";
import { NextResponse } from "next/server";

export type CVRequestError = { response: NextResponse };
export type CVRequestResult = { html: string };

/**
 * Parses and validates a CV generation FormData, resolves the brand color,
 * and renders the HTML. Used by both /api/generate and /api/preview.
 *
 * Returns either { html } on success or { response } (error NextResponse) on failure.
 */
export async function buildCVHtml(
  formData: FormData,
  inlineFonts: boolean,
): Promise<CVRequestResult | CVRequestError> {
  // Parse CV JSON
  const cvRaw = formData.get("cv");
  if (!cvRaw || typeof cvRaw !== "string") {
    return {
      response: NextResponse.json(
        { error: "CV data required" },
        { status: 400 },
      ),
    };
  }

  let cvJson: unknown;
  try {
    cvJson = JSON.parse(cvRaw);
  } catch {
    return {
      response: NextResponse.json(
        { error: "Invalid JSON in cv field" },
        { status: 400 },
      ),
    };
  }

  const parseResult = CVSchema.safeParse(cvJson);
  if (!parseResult.success) {
    return {
      response: NextResponse.json(
        { error: "Invalid CV data", details: parseResult.error.flatten() },
        { status: 400 },
      ),
    };
  }
  const cv: CVData = parseResult.data;

  // Parse photo
  let photoBase64: string | undefined;
  const photoFile = formData.get("photo");
  if (photoFile instanceof File) {
    if (photoFile.size > MAX_PHOTO_SIZE) {
      return {
        response: NextResponse.json(
          { error: "Photo too large (max 5MB)" },
          { status: 413 },
        ),
      };
    }
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const mime = photoFile.type || "image/jpeg";
    photoBase64 = `data:${mime};base64,${buffer.toString("base64")}`;
  }

  // Resolve color
  const domain = formData.get("domain");
  const forcedColor = formData.get("color");
  const theme = (formData.get("theme") as "light" | "dark") || "light";
  const cvLanguage = (formData.get("cvLanguage") as CVLanguage) || "fr";
  const cvTemplate = (formData.get("cvTemplate") as CvTemplate) || "modern";

  let color = "005eb8";
  if (typeof forcedColor === "string" && forcedColor.trim()) {
    color = forcedColor.trim();
  } else if (typeof domain === "string" && domain.trim()) {
    color = await ColorService.findBrandColor(domain.trim());
  }

  const html = await renderCV({
    cv,
    photoBase64,
    color,
    theme,
    cvLanguage,
    inlineFonts,
    cvTemplate,
  });
  return { html };
}

export function isError(
  result: CVRequestResult | CVRequestError,
): result is CVRequestError {
  return "response" in result;
}
