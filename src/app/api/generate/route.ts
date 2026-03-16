import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { CVSchema } from "@/lib/schemas/cv.schema";
import { ColorService } from "@/lib/color/color.service";
import { renderCV } from "@/lib/pdf/renderer";
import { BrowserService } from "@/lib/pdf/browser";
import { TokenStore } from "@/lib/tokens/token.store";
import logger from "@/lib/logger";

export const runtime = "nodejs";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Parse CV data
    const cvRaw = formData.get("cv");
    if (!cvRaw || typeof cvRaw !== "string") {
      return NextResponse.json({ error: "CV data required" }, { status: 400 });
    }

    let cvJson: unknown;
    try {
      cvJson = JSON.parse(cvRaw);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in cv field" },
        { status: 400 },
      );
    }

    const parseResult = CVSchema.safeParse(cvJson);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid CV data", details: parseResult.error.flatten() },
        { status: 400 },
      );
    }
    const cv = parseResult.data;

    // Handle photo
    let photoBase64: string | undefined;
    const photoFile = formData.get("photo");
    if (photoFile && photoFile instanceof File) {
      if (photoFile.size > MAX_PHOTO_SIZE) {
        return NextResponse.json(
          { error: "Photo too large (max 5MB)" },
          { status: 413 },
        );
      }
      const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
      const mime = photoFile.type || "image/jpeg";
      photoBase64 = `data:${mime};base64,${photoBuffer.toString("base64")}`;
    }

    // Resolve color
    const domain = formData.get("domain");
    const forcedColor = formData.get("color");
    const theme = (formData.get("theme") as "light" | "dark") || "light";

    let color = "005eb8";
    if (forcedColor && typeof forcedColor === "string" && forcedColor.trim()) {
      color = forcedColor.trim();
    } else if (domain && typeof domain === "string" && domain.trim()) {
      color = await ColorService.findBrandColor(domain.trim());
    }

    // Render HTML
    const html = await renderCV({ cv, photoBase64, color, theme });

    // Generate PDF
    const pdfBuffer = await BrowserService.generatePdf(html);

    // Store with token
    const token = crypto.randomUUID();
    TokenStore.set(token, pdfBuffer);

    return NextResponse.json({
      downloadUrl: `/api/download/${token}`,
      expiresIn: 300,
    });
  } catch (error) {
    logger.error({ err: error }, "CV generation failed");
    return NextResponse.json({ error: "Error generating CV" }, { status: 500 });
  }
}
