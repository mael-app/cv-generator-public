import { NextRequest, NextResponse } from "next/server";
import { BrowserService } from "@/lib/pdf/browser";
import { buildCVHtml, isError } from "@/lib/cv/cv-request.service";
import logger from "@/lib/logger";
import { apiGeneration } from "@/flags";

export const runtime = "nodejs";

const CLI_USER_AGENT_PATTERN =
  /(curl|wget|httpie|python-requests|go-http-client|powershell|postmanruntime|insomnia|node-fetch|axios|okhttp|libwww-perl)/i;

function isLikelyCliClient(request: NextRequest): boolean {
  const userAgent = request.headers.get("user-agent") ?? "";
  if (CLI_USER_AGENT_PATTERN.test(userAgent)) return true;

  const secFetchMode = request.headers.get("sec-fetch-mode");
  const secFetchSite = request.headers.get("sec-fetch-site");
  const secFetchDest = request.headers.get("sec-fetch-dest");
  const hasBrowserFetchHeaders =
    Boolean(secFetchMode) || Boolean(secFetchSite) || Boolean(secFetchDest);

  if (!userAgent.trim() && !hasBrowserFetchHeaders) return true;

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const isApiGenerationEnabled = await apiGeneration();
    if (!isApiGenerationEnabled && isLikelyCliClient(request)) {
      return NextResponse.json(
        { error: "API generation via CLI is currently disabled" },
        { status: 503 },
      );
    }

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
