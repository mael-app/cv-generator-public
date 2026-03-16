import { NextRequest, NextResponse } from "next/server";
import { buildCVHtml, isError } from "@/lib/cv/cv-request.service";
import logger from "@/lib/logger";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await buildCVHtml(formData, false);
    if (isError(result)) return result.response;

    return new NextResponse(result.html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    logger.error({ err: error }, "CV preview failed");
    return NextResponse.json(
      { error: "Error generating preview" },
      { status: 500 },
    );
  }
}
