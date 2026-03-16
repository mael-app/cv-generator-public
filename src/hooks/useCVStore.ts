"use client";

import { useState, useEffect, useCallback } from "react";
import { CVData } from "@/lib/schemas/cv.schema";
import { getLocalStorage, setLocalStorage } from "@/lib/storage/local-storage";

export interface CVSettings {
  domain: string;
  color: string;
  theme: "light" | "dark";
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
    setCVInternal(savedCV);
    setSettingsInternal(savedSettings);
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
    hydrated,
  };
}
