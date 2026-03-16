/**
 * Fetches Google Fonts CSS + font files and returns a self-contained <style> block
 * with all @font-face rules using base64 data URIs.
 * Result is cached in-memory for the lifetime of the process.
 */

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap";

// Pretend to be a modern browser so Google Fonts returns woff2
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

let cachedStyle: string | null = null;

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function fetchBase64(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Failed to fetch font ${url}: ${res.status}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf).toString("base64");
}

export async function getInlinedFontStyle(): Promise<string> {
  if (cachedStyle) return cachedStyle;

  const css = await fetchText(FONTS_URL);

  // Find all src: url(...) entries and replace with base64 data URIs
  const urlPattern =
    /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\) format\('woff2'\)/g;
  const matches = [...css.matchAll(urlPattern)];

  const replacements = await Promise.all(
    matches.map(async ([, url]) => {
      const b64 = await fetchBase64(url);
      return { url, dataUri: `data:font/woff2;base64,${b64}` };
    }),
  );

  let inlinedCss = css;
  for (const { url, dataUri } of replacements) {
    inlinedCss = inlinedCss.replaceAll(url, dataUri);
  }

  cachedStyle = `<style>\n${inlinedCss}\n</style>`;
  return cachedStyle;
}
