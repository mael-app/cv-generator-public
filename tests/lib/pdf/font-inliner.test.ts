import { describe, it, expect, vi, beforeEach } from "vitest";

// Each test re-imports the module fresh so the in-memory cache is cleared.
// vi.resetModules() achieves this by wiping the module registry.

describe("getInlinedFontStyle", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  async function importFreshModule() {
    const mod = await import("@/lib/pdf/font-inliner");
    return mod.getInlinedFontStyle;
  }

  function mockFetch(cssMock: string, fontBase64 = "AAAA") {
    const fontResponse = {
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(Buffer.from(fontBase64)),
    };
    global.fetch = vi
      .fn()
      // First call: CSS file
      .mockResolvedValueOnce({
        ok: true,
        text: vi.fn().mockResolvedValue(cssMock),
        arrayBuffer: vi.fn().mockResolvedValue(Buffer.from(fontBase64)),
      })
      // Subsequent calls: font binary files
      .mockResolvedValue(fontResponse);
  }

  it("wraps the inlined CSS in a <style> tag", async () => {
    mockFetch("/* some css */");
    const getInlinedFontStyle = await importFreshModule();

    const result = await getInlinedFontStyle();

    expect(result).toMatch(/^<style>/);
    expect(result).toMatch(/<\/style>$/);
  });

  it("replaces font URLs with base64 data URIs", async () => {
    const css = `src: url(https://fonts.gstatic.com/s/inter/v13/abc.woff2) format('woff2');`;
    mockFetch(css);
    const getInlinedFontStyle = await importFreshModule();

    const result = await getInlinedFontStyle();

    expect(result).toContain("data:font/woff2;base64,");
    expect(result).not.toContain("fonts.gstatic.com");
  });

  it("returns the CSS unchanged when there are no font URLs to replace", async () => {
    const css = `body { font-family: sans-serif; }`;
    mockFetch(css);
    const getInlinedFontStyle = await importFreshModule();

    const result = await getInlinedFontStyle();

    expect(result).toContain("body { font-family: sans-serif; }");
  });

  it("caches the result so subsequent calls do not re-fetch", async () => {
    mockFetch("/* cached css */");
    const getInlinedFontStyle = await importFreshModule();

    await getInlinedFontStyle();
    await getInlinedFontStyle();

    // fetch is called once for the CSS; no extra calls on the second invocation
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("propagates the error when the CSS fetch fails", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 503 });

    const getInlinedFontStyle = await importFreshModule();

    await expect(getInlinedFontStyle()).rejects.toThrow();
  });
});
