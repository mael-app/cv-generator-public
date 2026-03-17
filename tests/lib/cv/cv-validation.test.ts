import { describe, it, expect } from "vitest";
import {
  validateCVEssentials,
  hasValidationErrors,
  CVValidationErrors,
} from "@/lib/cv/cv-validation";
import { CVData } from "@/lib/schemas/cv.schema";

const validCV: CVData = {
  header: {
    name: "Jane Doe",
    title: "Engineer",
    jobSearchGoal: "Full-time role",
    age: "28",
    contact: {
      location: "Paris, France",
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

describe("validateCVEssentials", () => {
  // ── No errors on valid data ─────────────────────────────────────────────

  it("returns no errors for a fully valid CV", () => {
    const errors = validateCVEssentials(validCV);
    expect(hasValidationErrors(errors)).toBe(false);
  });

  it("returns no errors when optional fields (age, github, projects) are empty", () => {
    const cv: CVData = {
      ...validCV,
      header: {
        ...validCV.header,
        age: "",
        contact: { ...validCV.header.contact, github: "" },
      },
      projects: [],
    };
    const errors = validateCVEssentials(cv);
    expect(hasValidationErrors(errors)).toBe(false);
  });

  // ── header.name ──────────────────────────────────────────────────────────

  it("reports an error when header.name is empty", () => {
    const cv: CVData = { ...validCV, header: { ...validCV.header, name: "" } };
    const errors = validateCVEssentials(cv);
    expect(errors.header?.name).toBe(true);
  });

  it("reports an error when header.name is whitespace only", () => {
    const cv: CVData = {
      ...validCV,
      header: { ...validCV.header, name: "   " },
    };
    const errors = validateCVEssentials(cv);
    expect(errors.header?.name).toBe(true);
  });

  it("does not report a name error when header.name is provided", () => {
    const errors = validateCVEssentials(validCV);
    expect(errors.header?.name).toBeUndefined();
  });

  // ── header.contact.email ──────────────────────────────────────────────────

  it("reports an error when the email is empty", () => {
    const cv: CVData = {
      ...validCV,
      header: {
        ...validCV.header,
        contact: { ...validCV.header.contact, email: "" },
      },
    };
    const errors = validateCVEssentials(cv);
    expect(errors.header?.contact?.email).toBe(true);
  });

  it("reports an error when the email format is invalid", () => {
    const cv: CVData = {
      ...validCV,
      header: {
        ...validCV.header,
        contact: { ...validCV.header.contact, email: "not-an-email" },
      },
    };
    const errors = validateCVEssentials(cv);
    expect(errors.header?.contact?.email).toBe(true);
  });

  it("does not report an email error for a valid email", () => {
    const errors = validateCVEssentials(validCV);
    expect(errors.header?.contact?.email).toBeUndefined();
  });

  // ── experiences ───────────────────────────────────────────────────────────

  it("returns no errors for an empty experiences array", () => {
    const errors = validateCVEssentials({ ...validCV, experiences: [] });
    expect(errors.experiences).toBeUndefined();
  });

  it("reports an error for an experience entry with an empty role", () => {
    const cv: CVData = {
      ...validCV,
      experiences: [
        {
          role: "",
          company: "ACME",
          date: "2022",
          description: "Desc",
          tasks: [],
        },
      ],
    };
    const errors = validateCVEssentials(cv);
    expect(errors.experiences?.[0]?.role).toBe(true);
  });

  it("reports an error for an experience entry with a whitespace-only role", () => {
    const cv: CVData = {
      ...validCV,
      experiences: [
        {
          role: "  ",
          company: "ACME",
          date: "2022",
          description: "Desc",
          tasks: [],
        },
      ],
    };
    const errors = validateCVEssentials(cv);
    expect(errors.experiences?.[0]?.role).toBe(true);
  });

  it("does not report a role error when the role is provided", () => {
    const cv: CVData = {
      ...validCV,
      experiences: [
        {
          role: "Developer",
          company: "ACME",
          date: "2022",
          description: "Desc",
          tasks: [],
        },
      ],
    };
    const errors = validateCVEssentials(cv);
    expect(errors.experiences?.[0]?.role).toBeUndefined();
  });

  it("only reports errors for the experience entries that have an empty role", () => {
    const cv: CVData = {
      ...validCV,
      experiences: [
        {
          role: "Developer",
          company: "A",
          date: "2022",
          description: "",
          tasks: [],
        },
        { role: "", company: "B", date: "2023", description: "", tasks: [] },
        {
          role: "Designer",
          company: "C",
          date: "2024",
          description: "",
          tasks: [],
        },
      ],
    };
    const errors = validateCVEssentials(cv);
    expect(errors.experiences?.[0]).toBeUndefined();
    expect(errors.experiences?.[1]?.role).toBe(true);
    expect(errors.experiences?.[2]).toBeUndefined();
  });

  // ── education ─────────────────────────────────────────────────────────────

  it("returns no errors for an empty education array", () => {
    const errors = validateCVEssentials({ ...validCV, education: [] });
    expect(errors.education).toBeUndefined();
  });

  it("reports an error for an education entry with an empty degree", () => {
    const cv: CVData = {
      ...validCV,
      education: [{ degree: "", school: "MIT", date: "2020", details: "" }],
    };
    const errors = validateCVEssentials(cv);
    expect(errors.education?.[0]?.degree).toBe(true);
  });

  it("reports an error for an education entry with a whitespace-only degree", () => {
    const cv: CVData = {
      ...validCV,
      education: [{ degree: "  ", school: "MIT", date: "2020", details: "" }],
    };
    const errors = validateCVEssentials(cv);
    expect(errors.education?.[0]?.degree).toBe(true);
  });

  it("does not report a degree error when the degree is provided", () => {
    const cv: CVData = {
      ...validCV,
      education: [
        { degree: "BSc CS", school: "MIT", date: "2020", details: "" },
      ],
    };
    const errors = validateCVEssentials(cv);
    expect(errors.education?.[0]?.degree).toBeUndefined();
  });

  it("only reports errors for the education entries that have an empty degree", () => {
    const cv: CVData = {
      ...validCV,
      education: [
        { degree: "BSc", school: "A", date: "2018", details: "" },
        { degree: "", school: "B", date: "2020", details: "" },
        { degree: "PhD", school: "C", date: "2023", details: "" },
      ],
    };
    const errors = validateCVEssentials(cv);
    expect(errors.education?.[0]).toBeUndefined();
    expect(errors.education?.[1]?.degree).toBe(true);
    expect(errors.education?.[2]).toBeUndefined();
  });

  // ── multiple errors at once ───────────────────────────────────────────────

  it("can report multiple errors simultaneously", () => {
    const cv: CVData = {
      ...validCV,
      header: {
        ...validCV.header,
        name: "",
        contact: { ...validCV.header.contact, email: "bad" },
      },
      experiences: [
        { role: "", company: "X", date: "2022", description: "", tasks: [] },
      ],
      education: [{ degree: "", school: "MIT", date: "2020", details: "" }],
    };
    const errors = validateCVEssentials(cv);
    expect(errors.header?.name).toBe(true);
    expect(errors.header?.contact?.email).toBe(true);
    expect(errors.experiences?.[0]?.role).toBe(true);
    expect(errors.education?.[0]?.degree).toBe(true);
  });
});

describe("hasValidationErrors", () => {
  it("returns false for an empty errors object", () => {
    expect(hasValidationErrors({})).toBe(false);
  });

  it("returns true when header.name error is present", () => {
    const errors: CVValidationErrors = { header: { name: true } };
    expect(hasValidationErrors(errors)).toBe(true);
  });

  it("returns true when header.contact.email error is present", () => {
    const errors: CVValidationErrors = {
      header: { contact: { email: true } },
    };
    expect(hasValidationErrors(errors)).toBe(true);
  });

  it("returns false when header exists but contains no flagged fields", () => {
    const errors: CVValidationErrors = { header: {} };
    expect(hasValidationErrors(errors)).toBe(false);
  });

  it("returns true when there is at least one experience error", () => {
    const errors: CVValidationErrors = { experiences: { 0: { role: true } } };
    expect(hasValidationErrors(errors)).toBe(true);
  });

  it("returns true when there is at least one education error", () => {
    const errors: CVValidationErrors = { education: { 1: { degree: true } } };
    expect(hasValidationErrors(errors)).toBe(true);
  });

  it("returns false when experiences object is empty", () => {
    const errors: CVValidationErrors = { experiences: {} };
    expect(hasValidationErrors(errors)).toBe(false);
  });

  it("returns false when education object is empty", () => {
    const errors: CVValidationErrors = { education: {} };
    expect(hasValidationErrors(errors)).toBe(false);
  });
});
