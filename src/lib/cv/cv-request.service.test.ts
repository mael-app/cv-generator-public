import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock heavy dependencies before importing the service
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body: unknown, init?: { status?: number }) => ({
      _body: body,
      status: init?.status ?? 200,
    })),
  },
}));

vi.mock("@/lib/pdf/renderer", () => ({
  renderCV: vi.fn().mockResolvedValue("<html>CV</html>"),
}));

vi.mock("@/lib/color/color.service", () => ({
  ColorService: {
    findBrandColor: vi.fn().mockResolvedValue("#336699"),
  },
}));

import { buildCVHtml, isError } from "@/lib/cv/cv-request.service";
import { renderCV } from "@/lib/pdf/renderer";
import { ColorService } from "@/lib/color/color.service";
import { MAX_PHOTO_SIZE } from "@/lib/cv/constants";

const mockRenderCV = vi.mocked(renderCV);
const mockFindBrandColor = vi.mocked(ColorService.findBrandColor);

const validCVData = {
  header: {
    name: "Jane Doe",
    title: "Engineer",
    jobSearchGoal: "Full-time role",
    age: "28",
    contact: {
      location: "Lyon, France",
      email: "jane@example.com",
      github: "janedoe",
      linkedin: "janedoe",
      phone: "+33600000000",
    },
  },
  experiences: [],
  projects: [],
  education: [],
  skills: [],
  languages: [],
  softSkills: [],
};

function makeFormData(overrides: Record<string, string | File> = {}): FormData {
  const fd = new FormData();
  fd.append("cv", JSON.stringify(validCVData));
  for (const [k, v] of Object.entries(overrides)) {
    fd.append(k, v);
  }
  return fd;
}

describe("buildCVHtml", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRenderCV.mockResolvedValue("<html>CV</html>");
    mockFindBrandColor.mockResolvedValue("#336699");
  });

  // ── Error cases ──────────────────────────────────────────────────────────

  it("returns a 400 error response when the cv field is absent", async () => {
    const fd = new FormData();
    const result = await buildCVHtml(fd, false);
    expect(isError(result)).toBe(true);
    if (isError(result)) {
      expect((result.response as unknown as { status: number }).status).toBe(
        400,
      );
    }
  });

  it("returns a 400 error response when the cv field is not a string", async () => {
    // FormData.get() returning a File would not be a string
    const fd = new FormData();
    const file = new File(["{}"], "cv.json", { type: "application/json" });
    fd.append("cv", file);
    const result = await buildCVHtml(fd, false);
    expect(isError(result)).toBe(true);
    if (isError(result)) {
      expect((result.response as unknown as { status: number }).status).toBe(
        400,
      );
    }
  });

  it("returns a 400 error response when the cv field contains invalid JSON", async () => {
    const fd = new FormData();
    fd.append("cv", "{ not json }");
    const result = await buildCVHtml(fd, false);
    expect(isError(result)).toBe(true);
    if (isError(result)) {
      expect((result.response as unknown as { status: number }).status).toBe(
        400,
      );
    }
  });

  it("returns a 400 error response when the CV data fails schema validation", async () => {
    const fd = new FormData();
    fd.append("cv", JSON.stringify({ header: { name: "Only Name" } }));
    const result = await buildCVHtml(fd, false);
    expect(isError(result)).toBe(true);
    if (isError(result)) {
      expect((result.response as unknown as { status: number }).status).toBe(
        400,
      );
    }
  });

  it("returns a 413 error response when the photo exceeds MAX_PHOTO_SIZE", async () => {
    const largeBuffer = new Uint8Array(MAX_PHOTO_SIZE + 1);
    const file = new File([largeBuffer], "photo.jpg", { type: "image/jpeg" });
    const fd = makeFormData();
    fd.append("photo", file);

    const result = await buildCVHtml(fd, false);
    expect(isError(result)).toBe(true);
    if (isError(result)) {
      expect((result.response as unknown as { status: number }).status).toBe(
        413,
      );
    }
  });

  // ── Happy-path cases ──────────────────────────────────────────────────────

  it("returns html on success with no photo and no domain", async () => {
    const result = await buildCVHtml(makeFormData(), false);
    expect(isError(result)).toBe(false);
    if (!isError(result)) {
      expect(result.html).toBe("<html>CV</html>");
    }
  });

  it("passes base64-encoded photo data to renderCV", async () => {
    const content = new Uint8Array([0xff, 0xd8, 0xff]); // JPEG magic bytes
    const file = new File([content], "photo.jpg", { type: "image/jpeg" });
    const fd = makeFormData();
    fd.append("photo", file);

    const result = await buildCVHtml(fd, false);
    expect(isError(result)).toBe(false);

    const call = mockRenderCV.mock.calls[0][0];
    expect(call.photoBase64).toMatch(/^data:image\/jpeg;base64,/);
  });

  it("uses the forced color when provided instead of domain lookup", async () => {
    const fd = makeFormData({ color: "ff0000", domain: "example.com" });
    await buildCVHtml(fd, false);

    expect(mockFindBrandColor).not.toHaveBeenCalled();
    const call = mockRenderCV.mock.calls[0][0];
    expect(call.color).toBe("ff0000");
  });

  it("extracts the brand color from the domain when no forced color is given", async () => {
    const fd = makeFormData({ domain: "github.com" });
    await buildCVHtml(fd, false);

    expect(mockFindBrandColor).toHaveBeenCalledWith("github.com");
    const call = mockRenderCV.mock.calls[0][0];
    expect(call.color).toBe("#336699");
  });

  it("falls back to the default color when neither forced color nor domain is provided", async () => {
    const result = await buildCVHtml(makeFormData(), false);
    expect(isError(result)).toBe(false);

    const call = mockRenderCV.mock.calls[0][0];
    expect(call.color).toBe("005eb8");
  });

  it("passes the theme and cvLanguage from FormData to renderCV", async () => {
    const fd = makeFormData({ theme: "dark", cvLanguage: "en" });
    await buildCVHtml(fd, false);

    const call = mockRenderCV.mock.calls[0][0];
    expect(call.theme).toBe("dark");
    expect(call.cvLanguage).toBe("en");
  });

  it("defaults to light theme and fr language when not provided", async () => {
    await buildCVHtml(makeFormData(), false);

    const call = mockRenderCV.mock.calls[0][0];
    expect(call.theme).toBe("light");
    expect(call.cvLanguage).toBe("fr");
  });

  it("passes the inlineFonts flag to renderCV", async () => {
    await buildCVHtml(makeFormData(), true);
    expect(mockRenderCV.mock.calls[0][0].inlineFonts).toBe(true);
  });
});

describe("isError", () => {
  it("returns true for an error result", () => {
    const errorResult = { response: {} };
    expect(isError(errorResult as never)).toBe(true);
  });

  it("returns false for a success result", () => {
    const successResult = { html: "<html/>" };
    expect(isError(successResult)).toBe(false);
  });
});
