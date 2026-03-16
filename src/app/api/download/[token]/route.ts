import { NextRequest, NextResponse } from "next/server";
import { TokenStore } from "@/lib/tokens/token.store";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const buffer = TokenStore.get(token);

  if (!buffer) {
    return NextResponse.json(
      { error: "Link expired or not found" },
      { status: 404 },
    );
  }

  // Delete immediately after retrieval
  TokenStore.delete(token);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="cv.pdf"',
      "Content-Length": buffer.length.toString(),
    },
  });
}
