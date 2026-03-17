import { CVData } from "@/lib/schemas/cv.schema";
import { z } from "zod";

export interface CVValidationErrors {
  header?: {
    name?: true;
    contact?: {
      email?: true;
    };
  };
  experiences?: Record<number, { role?: true }>;
  education?: Record<number, { degree?: true }>;
}

export function validateCVEssentials(cv: CVData): CVValidationErrors {
  const errors: CVValidationErrors = {};

  if (!cv.header.name.trim()) {
    errors.header = { ...errors.header, name: true };
  }

  if (!z.string().email().safeParse(cv.header.contact.email).success) {
    errors.header = {
      ...errors.header,
      contact: { ...errors.header?.contact, email: true },
    };
  }

  cv.experiences.forEach((exp, i) => {
    if (!exp.role.trim()) {
      if (!errors.experiences) errors.experiences = {};
      errors.experiences[i] = { ...errors.experiences[i], role: true };
    }
  });

  cv.education.forEach((edu, i) => {
    if (!edu.degree.trim()) {
      if (!errors.education) errors.education = {};
      errors.education[i] = { ...errors.education[i], degree: true };
    }
  });

  return errors;
}

export function hasValidationErrors(errors: CVValidationErrors): boolean {
  if (errors.header?.name) return true;
  if (errors.header?.contact?.email) return true;
  if (errors.experiences && Object.keys(errors.experiences).length > 0)
    return true;
  if (errors.education && Object.keys(errors.education).length > 0) return true;
  return false;
}
