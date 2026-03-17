import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCVStore } from "@/hooks/useCVStore";

describe("useCVStore", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("initialises with the default empty CV state", () => {
    const { result } = renderHook(() => useCVStore());
    expect(result.current.cv.header.name).toBe("");
    expect(result.current.cv.experiences).toEqual([]);
    expect(result.current.cv.skills).toEqual([]);
  });

  it("initialises with the default settings", () => {
    const { result } = renderHook(() => useCVStore());
    expect(result.current.settings.theme).toBe("light");
    expect(result.current.settings.cvLanguage).toBe("auto");
    expect(result.current.settings.domain).toBe("");
  });

  it("marks as hydrated after mount", async () => {
    const { result } = renderHook(() => useCVStore());
    // hydrated is set inside a useEffect, so wait for it
    await act(async () => {});
    expect(result.current.hydrated).toBe(true);
  });

  it("loads CV data that was pre-stored in localStorage", async () => {
    const saved = {
      header: {
        name: "Alice",
        title: "Developer",
        jobSearchGoal: "",
        age: "28",
        contact: {
          location: "",
          email: "alice@example.com",
          github: "",
          linkedin: "",
          phone: "",
        },
      },
      experiences: [],
      projects: [],
      education: [],
      skills: ["TypeScript"],
      languages: [],
      softSkills: [],
    };
    localStorage.setItem("cv-data", JSON.stringify(saved));

    const { result } = renderHook(() => useCVStore());
    await act(async () => {});

    expect(result.current.cv.header.name).toBe("Alice");
    expect(result.current.cv.skills).toEqual(["TypeScript"]);
  });

  it("loads settings that were pre-stored in localStorage", async () => {
    const saved = {
      domain: "github.com",
      color: "#ff0000",
      theme: "dark" as const,
      cvLanguage: "en" as const,
    };
    localStorage.setItem("cv-settings", JSON.stringify(saved));

    const { result } = renderHook(() => useCVStore());
    await act(async () => {});

    expect(result.current.settings.theme).toBe("dark");
    expect(result.current.settings.domain).toBe("github.com");
  });

  it("persists CV updates to localStorage", async () => {
    const { result } = renderHook(() => useCVStore());
    await act(async () => {});

    act(() => {
      result.current.setCV((prev) => ({
        ...prev,
        header: { ...prev.header, name: "Bob" },
      }));
    });

    // Wait for the persistence useEffect to fire
    await act(async () => {});

    const stored = JSON.parse(localStorage.getItem("cv-data") ?? "{}");
    expect(stored.header.name).toBe("Bob");
  });

  it("persists settings updates to localStorage", async () => {
    const { result } = renderHook(() => useCVStore());
    await act(async () => {});

    act(() => {
      result.current.setSettings((prev) => ({ ...prev, theme: "dark" }));
    });

    await act(async () => {});

    const stored = JSON.parse(localStorage.getItem("cv-settings") ?? "{}");
    expect(stored.theme).toBe("dark");
  });

  it("setPhotoPreview stores the preview in localStorage", async () => {
    const { result } = renderHook(() => useCVStore());
    await act(async () => {});

    act(() => {
      result.current.setPhotoPreview("data:image/jpeg;base64,abc123");
    });

    const stored = localStorage.getItem("cv-photo-preview");
    expect(stored).toBe(JSON.stringify("data:image/jpeg;base64,abc123"));
    expect(result.current.photoPreview).toBe("data:image/jpeg;base64,abc123");
  });

  it("clearPhoto resets photoFile and photoPreview", async () => {
    const { result } = renderHook(() => useCVStore());
    await act(async () => {});

    act(() => {
      result.current.setPhotoPreview("data:image/jpeg;base64,abc123");
    });

    act(() => {
      result.current.clearPhoto();
    });

    expect(result.current.photoPreview).toBe("");
    expect(result.current.photoFile).toBeNull();
    const stored = localStorage.getItem("cv-photo-preview");
    expect(stored).toBe(JSON.stringify(""));
  });

  it("clearAll resets CV and settings to defaults and clears storage", async () => {
    const { result } = renderHook(() => useCVStore());
    await act(async () => {});

    // Set some state first
    act(() => {
      result.current.setCV((prev) => ({
        ...prev,
        header: { ...prev.header, name: "Charlie" },
      }));
      result.current.setSettings((prev) => ({ ...prev, theme: "dark" }));
      result.current.setPhotoPreview("data:image/jpeg;base64,xyz");
    });
    await act(async () => {});

    act(() => {
      result.current.clearAll();
    });
    await act(async () => {});

    expect(result.current.cv.header.name).toBe("");
    expect(result.current.settings.theme).toBe("light");
    expect(result.current.photoPreview).toBe("");
    expect(result.current.photoFile).toBeNull();
  });
});
