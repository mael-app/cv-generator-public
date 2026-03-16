import { NextRequest, NextResponse } from "next/server";
import { BrowserService } from "@/lib/pdf/browser";
import { buildCVHtml, isError } from "@/lib/cv/cv-request.service";
import logger from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await buildCVHtml(formData, true);
    if (isError(result)) return result.response;

    const pdfBuffer = await BrowserService.generatePdf(result.html);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cv.pdf"',
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    logger.error({ err: error }, "CV generation failed");
    return NextResponse.json({ error: "Error generating CV" }, { status: 500 });
  }
}
