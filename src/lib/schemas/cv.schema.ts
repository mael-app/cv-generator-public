import { z } from "zod";

export const ContactSchema = z.object({
  location: z.string(),
  email: z.string().email(),
  github: z.string(),
  linkedin: z.string(),
  phone: z.string(),
});

export const HeaderSchema = z.object({
  name: z.string(),
  title: z.string(),
  jobSearchGoal: z.string(),
  age: z.string(),
  contact: ContactSchema,
});

export const ExperienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  date: z.string(),
  description: z.string(),
  tasks: z.array(z.string()),
});

export const ProjectSchema = z.object({
  title: z.string(),
  stack: z.string(),
  description: z.string(),
});

export const EducationSchema = z.object({
  degree: z.string(),
  school: z.string(),
  date: z.string(),
  details: z.string(),
});

export const LanguageSchema = z.object({
  name: z.string(),
  level: z.string(),
});

export const CVSchema = z.object({
  header: HeaderSchema,
  experiences: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  education: z.array(EducationSchema),
  skills: z.array(z.string()),
  languages: z.array(LanguageSchema),
  softSkills: z.array(z.string()),
});

export type CVData = z.infer<typeof CVSchema>;
export type ContactData = z.infer<typeof ContactSchema>;
export type HeaderData = z.infer<typeof HeaderSchema>;
export type ExperienceData = z.infer<typeof ExperienceSchema>;
export type ProjectData = z.infer<typeof ProjectSchema>;
export type EducationData = z.infer<typeof EducationSchema>;
export type LanguageData = z.infer<typeof LanguageSchema>;
