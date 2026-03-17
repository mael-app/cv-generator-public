import { describe, it, expect, vi, beforeEach } from "vitest";
import { CVData } from "@/lib/schemas/cv.schema";

// Mock font inliner to avoid real network calls
vi.mock("@/lib/pdf/font-inliner", () => ({
  getInlinedFontStyle: vi.fn().mockResolvedValue("<style>/* fonts */</style>"),
}));

import { renderCV } from "@/lib/pdf/renderer";

const fullCV: CVData = {
  header: {
    name: "Jane Doe",
    title: "Software Engineer",
    jobSearchGoal: "Looking for a full-time role",
    age: "28",
    contact: {
      location: "Paris, France",
      email: "jane@example.com",
      github: "github.com/janedoe",
      linkedin: "linkedin.com/in/janedoe",
      phone: "+33600000000",
    },
  },
  experiences: [
    {
      role: "Developer",
      company: "ACME",
      date: "2022–2024",
      description: "Built things",
      tasks: ["Task A"],
    },
  ],
  projects: [
    { title: "My App", stack: "React", description: "A cool project" },
  ],
  education: [
    { degree: "BSc CS", school: "MIT", date: "2020", details: "With honors" },
  ],
  skills: ["TypeScript", "React"],
  languages: [{ name: "English", level: "Native" }],
  softSkills: ["Leadership"],
};

async function render(cv: CVData, photoBase64?: string): Promise<string> {
  return renderCV({
    cv,
    photoBase64,
    color: "005eb8",
    theme: "light",
    cvLanguage: "en",
    inlineFonts: false,
  });
}

describe("renderCV — contact items", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders all contact items when all fields are filled", async () => {
    const html = await render(fullCV);
    expect(html).toContain("jane@example.com");
    expect(html).toContain("Paris, France");
    expect(html).toContain("+33600000000");
    expect(html).toContain("@janedoe"); // GitHub label
    expect(html).toContain("janedoe"); // LinkedIn label
    expect(html).toContain("28"); // age
  });

  it("omits the GitHub icon and link when github is empty", async () => {
    const cv: CVData = {
      ...fullCV,
      header: {
        ...fullCV.header,
        contact: { ...fullCV.header.contact, github: "" },
      },
    };
    const html = await render(cv);
    expect(html).not.toContain("@janedoe");
    // GitHub SVG path is unique — the curved fork path
    expect(html).not.toContain("M9 18c-4.51 2-5-2-7-2");
  });

  it("omits the LinkedIn icon and link when linkedin is empty", async () => {
    const cv: CVData = {
      ...fullCV,
      header: {
        ...fullCV.header,
        contact: { ...fullCV.header.contact, linkedin: "" },
      },
    };
    const html = await render(cv);
    // LinkedIn SVG has a distinctive rect element
    expect(html).not.toContain('rect width="4" height="12"');
    // The linkedin.com URL must not appear
    expect(html).not.toContain("linkedin.com");
  });

  it("omits the age icon when age is empty", async () => {
    const cv: CVData = {
      ...fullCV,
      header: { ...fullCV.header, age: "" },
    };
    const html = await render(cv);
    // The person/age SVG has a unique circle cx="12" cy="8"
    expect(html).not.toContain('cy="8"');
    expect(html).not.toContain(">28<");
  });

  it("omits the location icon when location is empty", async () => {
    const cv: CVData = {
      ...fullCV,
      header: {
        ...fullCV.header,
        contact: { ...fullCV.header.contact, location: "" },
      },
    };
    const html = await render(cv);
    // The map-pin SVG has a distinctive path starting with M20 10
    expect(html).not.toContain("M20 10c0 6-8 12-8 12");
    expect(html).not.toContain("Paris, France");
  });

  it("omits the email icon and link when email is empty", async () => {
    const cv: CVData = {
      ...fullCV,
      header: {
        ...fullCV.header,
        contact: { ...fullCV.header.contact, email: "" },
      },
    };
    const html = await render(cv);
    // The email SVG has a distinctive rect width="20" height="16"
    expect(html).not.toContain('width="20" height="16"');
    expect(html).not.toContain("jane@example.com");
  });

  it("omits the phone icon when phone is empty", async () => {
    const cv: CVData = {
      ...fullCV,
      header: {
        ...fullCV.header,
        contact: { ...fullCV.header.contact, phone: "" },
      },
    };
    const html = await render(cv);
    // The phone SVG has a distinctive path starting with M22 16.92
    expect(html).not.toContain("M22 16.92v3");
    expect(html).not.toContain("+33600000000");
  });
});

describe("renderCV — section headings", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders all section headings when all sections have content", async () => {
    const html = await render(fullCV);
    expect(html).toContain("Work Experience");
    expect(html).toContain("Significant Projects");
    expect(html).toContain("Education");
    expect(html).toContain("Hard Skills");
    expect(html).toContain("Soft Skills");
    expect(html).toContain("Languages");
  });

  it("omits the Work Experience heading when experiences is empty", async () => {
    const html = await render({ ...fullCV, experiences: [] });
    expect(html).not.toContain("Work Experience");
  });

  it("omits the Significant Projects heading when projects is empty", async () => {
    const html = await render({ ...fullCV, projects: [] });
    expect(html).not.toContain("Significant Projects");
  });

  it("omits the Education heading when education is empty", async () => {
    const html = await render({ ...fullCV, education: [] });
    expect(html).not.toContain("Education");
  });

  it("omits the Hard Skills heading when skills is empty", async () => {
    const html = await render({ ...fullCV, skills: [] });
    expect(html).not.toContain("Hard Skills");
  });

  it("omits the Soft Skills heading when softSkills is empty", async () => {
    const html = await render({ ...fullCV, softSkills: [] });
    expect(html).not.toContain("Soft Skills");
  });

  it("omits the Languages heading when languages is empty", async () => {
    const html = await render({ ...fullCV, languages: [] });
    expect(html).not.toContain("Languages");
  });

  it("can render a minimal CV with only header fields and no sections", async () => {
    const cv: CVData = {
      ...fullCV,
      experiences: [],
      projects: [],
      education: [],
      skills: [],
      languages: [],
      softSkills: [],
    };
    const html = await render(cv);
    expect(html).toContain("Jane Doe");
    expect(html).not.toContain("Work Experience");
    expect(html).not.toContain("Significant Projects");
    expect(html).not.toContain("Education");
    expect(html).not.toContain("Hard Skills");
    expect(html).not.toContain("Soft Skills");
    expect(html).not.toContain("Languages");
  });
});

describe("renderCV — GitHub/LinkedIn URL formatting", () => {
  beforeEach(() => vi.clearAllMocks());

  it("formats a github.com-prefixed username into a full URL and @-label", async () => {
    const cv: CVData = {
      ...fullCV,
      header: {
        ...fullCV.header,
        contact: { ...fullCV.header.contact, github: "github.com/janedoe" },
      },
    };
    const html = await render(cv);
    expect(html).toContain("https://github.com/janedoe");
    expect(html).toContain("@janedoe");
  });

  it("preserves a full github.com URL and formats the label", async () => {
    const cv: CVData = {
      ...fullCV,
      header: {
        ...fullCV.header,
        contact: {
          ...fullCV.header.contact,
          github: "https://github.com/janedoe",
        },
      },
    };
    const html = await render(cv);
    expect(html).toContain("https://github.com/janedoe");
    expect(html).toContain("@janedoe");
  });

  it("formats a full linkedin.com/in URL and shows a short label", async () => {
    const cv: CVData = {
      ...fullCV,
      header: {
        ...fullCV.header,
        contact: {
          ...fullCV.header.contact,
          linkedin: "https://linkedin.com/in/jane-doe",
        },
      },
    };
    const html = await render(cv);
    expect(html).toContain("https://linkedin.com/in/jane-doe");
    expect(html).toContain("jane-doe");
  });

  it("does not render github/linkedin items when both are empty", async () => {
    const cv: CVData = {
      ...fullCV,
      header: {
        ...fullCV.header,
        contact: {
          ...fullCV.header.contact,
          github: "",
          linkedin: "",
        },
      },
    };
    const html = await render(cv);
    expect(html).not.toContain("M9 18c-4.51 2-5-2-7-2"); // GitHub SVG path
    expect(html).not.toContain('rect width="4" height="12"'); // LinkedIn SVG rect
  });
});
