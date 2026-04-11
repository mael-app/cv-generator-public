"use client";

import { useState, useEffect, useCallback } from "react";
import { CVData } from "@/lib/schemas/cv.schema";
import { getLocalStorage, setLocalStorage } from "@/lib/storage/local-storage";

import type { CVLanguage, CvTemplate } from "@/lib/pdf/renderer";
export type { CVLanguage };

export interface CVSettings {
  domain: string;
  color: string;
  theme: "light" | "dark";
  cvLanguage: CVLanguage | "auto"; // "auto" = follow UI language
  cvTemplate: CvTemplate;
}

const DEFAULT_CV: CVData = {
  header: {
    name: "",
    title: "",
    jobSearchGoal: "",
    age: "",
    contact: {
      location: "",
      email: "",
      github: "",
      linkedin: "",
      phone: "",
    },
  },
  experiences: [],
  projects: [],
  education: [],
  skills: [],
  languages: [],
  softSkills: [],
};

const DEFAULT_SETTINGS: CVSettings = {
  domain: "",
  color: "",
  theme: "light",
  cvLanguage: "auto",
  cvTemplate: "modern",
};

export function useCVStore() {
  const [cv, setCVInternal] = useState<CVData>(DEFAULT_CV);
  const [settings, setSettingsInternal] =
    useState<CVSettings>(DEFAULT_SETTINGS);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreviewInternal] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCV = getLocalStorage<CVData>("cv-data", DEFAULT_CV);
    const savedSettings = getLocalStorage<CVSettings>(
      "cv-settings",
      DEFAULT_SETTINGS,
    );
    const savedPhoto = getLocalStorage<string>("cv-photo-preview", "");
    const migratedSettings: CVSettings = {
      ...DEFAULT_SETTINGS,
      ...savedSettings,
    };
    setCVInternal(savedCV);
    setSettingsInternal(migratedSettings);
    setPhotoPreviewInternal(savedPhoto);
    setHydrated(true);
  }, []);

  // Persist CV on change
  useEffect(() => {
    if (!hydrated) return;
    setLocalStorage("cv-data", cv);
  }, [cv, hydrated]);

  // Persist settings on change
  useEffect(() => {
    if (!hydrated) return;
    setLocalStorage("cv-settings", settings);
  }, [settings, hydrated]);

  const setCV = useCallback((update: CVData | ((prev: CVData) => CVData)) => {
    setCVInternal(update);
  }, []);

  const setSettings = useCallback(
    (update: CVSettings | ((prev: CVSettings) => CVSettings)) => {
      setSettingsInternal(update);
    },
    [],
  );

  const setPhotoPreview = useCallback((preview: string) => {
    setPhotoPreviewInternal(preview);
    setLocalStorage("cv-photo-preview", preview);
  }, []);

  const clearPhoto = useCallback(() => {
    setPhotoFile(null);
    setPhotoPreviewInternal("");
    setLocalStorage("cv-photo-preview", "");
  }, []);

  const clearAll = useCallback(() => {
    setCVInternal(DEFAULT_CV);
    setSettingsInternal(DEFAULT_SETTINGS);
    setPhotoFile(null);
    setPhotoPreviewInternal("");
    setLocalStorage("cv-photo-preview", "");
  }, []);

  return {
    cv,
    setCV,
    settings,
    setSettings,
    photoFile,
    setPhotoFile,
    photoPreview,
    setPhotoPreview,
    clearPhoto,
    clearAll,
    hydrated,
  };
}
