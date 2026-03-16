import { NextRequest, NextResponse } from "next/server";
import { ColorService } from "@/lib/color/color.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ error: "Domain required" }, { status: 400 });
  }
  const color = await ColorService.findBrandColor(domain);
  return NextResponse.json({ color });
}
