import { describe, it, expect, vi, beforeEach } from "vitest";
import type getColorsType from "get-image-colors";

// Mock get-image-colors before importing the service
vi.mock("get-image-colors", () => ({
  default: vi.fn(),
}));

// Mock logger to suppress output in tests
vi.mock("@/lib/logger", () => ({
  default: { warn: vi.fn(), debug: vi.fn() },
}));

import { ColorService } from "@/lib/color/color.service";
import getColors from "get-image-colors";

const mockGetColors = vi.mocked(getColors);

type ColorPalette = Awaited<ReturnType<typeof getColorsType>>;

function makeColorEntry(hex: string, h: number, s: number, l: number) {
  return { hex: () => hex, hsl: () => [h, s, l] };
}

function mockPalette(...entries: ReturnType<typeof makeColorEntry>[]) {
  mockGetColors.mockResolvedValue(entries as unknown as ColorPalette);
}

function mockSuccessfulFetch() {
  const fakeBuffer = new ArrayBuffer(8);
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    arrayBuffer: vi.fn().mockResolvedValue(fakeBuffer),
  });
}

describe("ColorService.findBrandColor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the default color when fetch throws a network error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#005eb8");
  });

  it("returns the default color when the favicon HTTP response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#005eb8");
  });

  it("returns the default color when fetch times out (AbortError)", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValue(
        Object.assign(new Error("Aborted"), { name: "AbortError" }),
      );
    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#005eb8");
  });

  it("calls the Google favicon endpoint with the supplied domain", async () => {
    mockSuccessfulFetch();
    mockPalette(makeColorEntry("#336699", 210, 0.5, 0.4));

    await ColorService.findBrandColor("example.com");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("example.com"),
      expect.anything(),
    );
  });

  it("returns the extracted hex color for a well-formed image", async () => {
    mockSuccessfulFetch();
    mockPalette(makeColorEntry("#336699", 210, 0.5, 0.4));

    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#336699");
  });

  it("returns the default color when getColors throws", async () => {
    mockSuccessfulFetch();
    mockGetColors.mockRejectedValue(new Error("Cannot parse image"));

    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#005eb8");
  });
});

describe("ColorService – color filtering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSuccessfulFetch();
  });

  it("filters out near-white colors (luminance >= 0.95) and picks the next valid color", async () => {
    mockPalette(
      makeColorEntry("#fefefe", 0, 0.5, 0.98), // near-white → filtered
      makeColorEntry("#336699", 210, 0.5, 0.4), // valid
    );
    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#336699");
  });

  it("filters out near-black colors (luminance <= 0.05) and picks the next valid color", async () => {
    mockPalette(
      makeColorEntry("#010101", 0, 0.5, 0.02), // near-black → filtered
      makeColorEntry("#336699", 210, 0.5, 0.4), // valid
    );
    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#336699");
  });

  it("falls back to the first palette entry when all colors are filtered out", async () => {
    mockPalette(
      makeColorEntry("#ffffff", 0, 0, 1.0), // white
      makeColorEntry("#000000", 0, 0, 0.0), // black
    );
    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#ffffff");
  });

  it("returns the default color when the palette is empty", async () => {
    mockGetColors.mockResolvedValue([] as unknown as ColorPalette);
    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#005eb8");
  });

  it("accepts a color exactly at the luminance boundaries (0.05 < l < 0.95)", async () => {
    mockPalette(makeColorEntry("#1a3a6b", 220, 0.6, 0.06)); // just above black threshold
    const color = await ColorService.findBrandColor("example.com");
    expect(color).toBe("#1a3a6b");
  });
});
