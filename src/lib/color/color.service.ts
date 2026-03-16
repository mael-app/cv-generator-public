import getColors from "get-image-colors";

async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
): Promise<Buffer> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } finally {
    clearTimeout(timer);
  }
}

interface ColorMetric {
  hex: string;
  saturation: number;
  luminance: number;
}

export class ColorService {
  public static async findBrandColor(domain: string): Promise<string> {
    try {
      // 1. Try Clearbit
      try {
        console.log(`   🔎 Trying Clearbit...`);
        const buffer = await fetchWithTimeout(
          `https://logo.clearbit.com/${domain}`,
          2000,
        );
        return await this.extractColorFromBuffer(buffer, "image/png");
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.log(`   ⚠️  Clearbit failed (${errorMsg}), trying Google...`);
      }

      // 2. Try Google Favicon
      try {
        const buffer = await fetchWithTimeout(
          `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          2000,
        );
        return await this.extractColorFromBuffer(buffer, "image/png");
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.log(`   ⚠️  Google failed (${errorMsg}).`);
      }

      return "#005eb8"; // Ultimate fallback
    } catch (error) {
      console.error("❌ ColorService error:", error);
      return "#005eb8";
    }
  }

  private static async extractColorFromBuffer(
    buffer: Buffer,
    mime: string,
  ): Promise<string> {
    try {
      const colors = await getColors(buffer, mime);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metrics: ColorMetric[] = colors.map((c: any) => {
        const [, s, l] = c.hsl();
        return { hex: c.hex(), saturation: s, luminance: l };
      });

      console.log("   🎨 Palette found:", metrics.map((m) => m.hex).join(", "));

      const bestColor = metrics.find((c: ColorMetric) => {
        const isNotWhite = c.luminance < 0.95;
        const isNotBlack = c.luminance > 0.05;
        return isNotWhite && isNotBlack;
      });

      if (bestColor) {
        console.log(`   ✅ Color selected: ${bestColor.hex}`);
        return bestColor.hex;
      } else {
        console.log(
          "   No valid color after filtering (too white/black/grey).",
        );
      }

      // If no color passes filter, return the first one that isn't pure white
      return metrics[0]?.hex || "#005eb8";
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      console.log("   Error extracting color from image:", message);
      return "#005eb8";
    }
  }
}
