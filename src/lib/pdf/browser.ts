import puppeteerCore from "puppeteer-core";
import type { Browser } from "puppeteer-core";

async function launchBrowser(): Promise<Browser> {
  if (process.env.NODE_ENV === "production") {
    // Use stripped-down Chromium built for serverless (Vercel/Lambda)
    const { default: chromium } = await import("@sparticuz/chromium");
    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  // Development: use puppeteer's bundled Chromium (devDependency).
  // eval("require") prevents webpack from statically analyzing this import
  // so it doesn't fail the production build where puppeteer is not bundled.

  const puppeteer = eval("require")("puppeteer");
  return puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  }) as Browser;
}

export class BrowserService {
  public static async generatePdf(htmlContent: string): Promise<Buffer> {
    const browser = await launchBrowser();
    const page = await browser.newPage();

    // Block all external network requests — fonts are already inlined
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (req.url().startsWith("data:")) {
        req.continue();
      } else {
        req.abort();
      }
    });

    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }
}
