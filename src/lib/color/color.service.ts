import getColors from "get-image-colors";
import logger from "@/lib/logger";

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
        logger.debug("Trying Clearbit for brand color");
        const buffer = await fetchWithTimeout(
          `https://logo.clearbit.com/${domain}`,
          2000,
        );
        return await this.extractColorFromBuffer(buffer, "image/png");
      } catch (error) {
        logger.warn(
          { err: error },
          "Clearbit failed, falling back to Google Favicon",
        );
      }

      // 2. Try Google Favicon
      try {
        const buffer = await fetchWithTimeout(
          `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          2000,
        );
        return await this.extractColorFromBuffer(buffer, "image/png");
      } catch (error) {
        logger.warn(
          { err: error },
          "Google Favicon failed, using default color",
        );
      }

      return "#005eb8"; // Ultimate fallback
    } catch (error) {
      logger.error({ err: error }, "ColorService unexpected error");
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

      logger.debug(
        { palette: metrics.map((m) => m.hex) },
        "Color palette extracted",
      );

      const bestColor = metrics.find((c: ColorMetric) => {
        const isNotWhite = c.luminance < 0.95;
        const isNotBlack = c.luminance > 0.05;
        return isNotWhite && isNotBlack;
      });

      if (bestColor) {
        logger.debug({ color: bestColor.hex }, "Brand color selected");
        return bestColor.hex;
      } else {
        logger.debug(
          "No valid color after filtering (too white/black/grey), using first",
        );
      }

      // If no color passes filter, return the first one that isn't pure white
      return metrics[0]?.hex || "#005eb8";
    } catch (e: unknown) {
      logger.warn({ err: e }, "Error extracting color from image");
      return "#005eb8";
    }
  }
}
