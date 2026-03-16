import axios from "axios";
import getColors from "get-image-colors";

interface ColorMetric {
  hex: string;
  saturation: number;
  luminance: number;
}

export class ColorService {
  public static async findBrandColor(domain: string): Promise<string> {
    try {
      // 1. Essai Clearbit
      try {
        console.log(`   🔎 Trying Clearbit...`);
        const logoUrl = `https://logo.clearbit.com/${domain}`;
        const response = await axios.get(logoUrl, {
          responseType: "arraybuffer",
          timeout: 2000,
        });
        const buffer = Buffer.from(response.data, "binary");
        return await this.extractColorFromBuffer(buffer, "image/png");
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.log(`   ⚠️  Clearbit failed (${errorMsg}), trying Google...`);
      }

      // 2. Essai Google
      try {
        const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        const response = await axios.get(googleUrl, {
          responseType: "arraybuffer",
          timeout: 2000,
        });
        const buffer = Buffer.from(response.data, "binary");
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
        const isNotWhite = c.luminance < 0.95; // Relaxed from 0.90
        const isNotBlack = c.luminance > 0.05; // Relaxed from 0.10
        // const isNotGrey = c.saturation > 0.15; // Removed saturation filter for now
        return isNotWhite && isNotBlack;
      });

      if (bestColor) {
        console.log(`   ✅ Color selected: ${bestColor.hex}`);
        return bestColor.hex;
      } else {
        console.log(
          "   Aucune couleur valide après filtrage (trop blanc/noir/gris).",
        );
      }

      // If no color passes filter, return the first one that isn't pure white
      return metrics[0]?.hex || "#005eb8";
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      console.log("   Erreur extraction couleur image:", message);
      return "#005eb8";
    }
  }
}
