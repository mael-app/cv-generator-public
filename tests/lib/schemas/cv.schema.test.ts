import { describe, it, expect } from "vitest";
import {
  CVSchema,
  ContactSchema,
  HeaderSchema,
  ExperienceSchema,
  ProjectSchema,
  EducationSchema,
  LanguageSchema,
} from "@/lib/schemas/cv.schema";

const validContact = {
  location: "Paris, France",
  email: "john@example.com",
  github: "johndoe",
  linkedin: "johndoe",
  phone: "+33612345678",
};

const validHeader = {
  name: "John Doe",
  title: "Software Engineer",
  jobSearchGoal: "Looking for a full-time position",
  age: "30",
  contact: validContact,
};

const validCV = {
  header: validHeader,
  experiences: [
    {
      role: "Senior Developer",
      company: "ACME Corp",
      date: "2020 - Present",
      description: "Led development team",
      tasks: ["Task 1", "Task 2"],
    },
  ],
  projects: [
    {
      title: "My Project",
      stack: "React, TypeScript",
      description: "A cool project",
    },
  ],
  education: [
    {
      degree: "MSc Computer Science",
      school: "Paris University",
      date: "2018",
      details: "With distinction",
    },
  ],
  skills: ["TypeScript", "React"],
  languages: [{ name: "French", level: "Native" }],
  softSkills: ["Team player"],
};

function omitKey<T extends object>(obj: T, key: keyof T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => k !== key),
  ) as Partial<T>;
}

describe("ContactSchema", () => {
  it("validates a valid contact object", () => {
    expect(ContactSchema.safeParse(validContact).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = ContactSchema.safeParse({
      ...validContact,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing email field", () => {
    expect(
      ContactSchema.safeParse(omitKey(validContact, "email")).success,
    ).toBe(false);
  });
});

describe("HeaderSchema", () => {
  it("validates a valid header object", () => {
    expect(HeaderSchema.safeParse(validHeader).success).toBe(true);
  });

  it("rejects missing name", () => {
    expect(HeaderSchema.safeParse(omitKey(validHeader, "name")).success).toBe(
      false,
    );
  });

  it("rejects missing contact", () => {
    expect(
      HeaderSchema.safeParse(omitKey(validHeader, "contact")).success,
    ).toBe(false);
  });
});

describe("ExperienceSchema", () => {
  it("validates a valid experience entry", () => {
    expect(ExperienceSchema.safeParse(validCV.experiences[0]).success).toBe(
      true,
    );
  });

  it("allows an empty tasks array", () => {
    const exp = { ...validCV.experiences[0], tasks: [] };
    expect(ExperienceSchema.safeParse(exp).success).toBe(true);
  });

  it("rejects non-array tasks", () => {
    const exp = { ...validCV.experiences[0], tasks: "Task 1" };
    expect(ExperienceSchema.safeParse(exp).success).toBe(false);
  });
});

describe("ProjectSchema", () => {
  it("validates a valid project entry", () => {
    expect(ProjectSchema.safeParse(validCV.projects[0]).success).toBe(true);
  });

  it("rejects missing description", () => {
    expect(
      ProjectSchema.safeParse(omitKey(validCV.projects[0], "description"))
        .success,
    ).toBe(false);
  });
});

describe("EducationSchema", () => {
  it("validates a valid education entry", () => {
    expect(EducationSchema.safeParse(validCV.education[0]).success).toBe(true);
  });

  it("rejects missing degree", () => {
    expect(
      EducationSchema.safeParse(omitKey(validCV.education[0], "degree"))
        .success,
    ).toBe(false);
  });
});

describe("LanguageSchema", () => {
  it("validates a valid language entry", () => {
    expect(
      LanguageSchema.safeParse({ name: "English", level: "C2" }).success,
    ).toBe(true);
  });

  it("rejects missing level", () => {
    expect(LanguageSchema.safeParse({ name: "English" }).success).toBe(false);
  });
});

describe("CVSchema", () => {
  it("validates a complete valid CV object", () => {
    const result = CVSchema.safeParse(validCV);
    expect(result.success).toBe(true);
  });

  it("accepts empty arrays for all list fields", () => {
    const minimalCV = {
      ...validCV,
      experiences: [],
      projects: [],
      education: [],
      skills: [],
      languages: [],
      softSkills: [],
    };
    expect(CVSchema.safeParse(minimalCV).success).toBe(true);
  });

  it("rejects missing header", () => {
    expect(CVSchema.safeParse(omitKey(validCV, "header")).success).toBe(false);
  });

  it("rejects missing experiences field", () => {
    expect(CVSchema.safeParse(omitKey(validCV, "experiences")).success).toBe(
      false,
    );
  });

  it("rejects missing skills field", () => {
    expect(CVSchema.safeParse(omitKey(validCV, "skills")).success).toBe(false);
  });

  it("rejects invalid email in contact within header", () => {
    const result = CVSchema.safeParse({
      ...validCV,
      header: {
        ...validHeader,
        contact: { ...validContact, email: "bad-email" },
      },
    });
    expect(result.success).toBe(false);
  });

  it("includes flatten() error details on failure", () => {
    const result = CVSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = result.error.flatten();
      expect(flat).toBeDefined();
      expect(flat.fieldErrors).toBeDefined();
    }
  });

  it("rejects skills as a non-array", () => {
    const result = CVSchema.safeParse({ ...validCV, skills: "TypeScript" });
    expect(result.success).toBe(false);
  });
});
