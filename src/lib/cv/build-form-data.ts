import { CVData } from "@/lib/schemas/cv.schema";
import { CVSettings, CVLanguage } from "@/hooks/useCVStore";

export function buildCVFormData(
  cv: CVData,
  settings: CVSettings,
  photoFile: File | null,
  photoPreview: string,
  uiLang: CVLanguage,
): FormData {
  const formData = new FormData();
  formData.append("cv", JSON.stringify(cv));

  if (photoFile) {
    formData.append("photo", photoFile);
  } else if (photoPreview) {
    const [header, b64] = photoPreview.split(",");
    const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    formData.append("photo", new Blob([bytes], { type: mime }), "photo.jpg");
  }

  if (settings.domain) formData.append("domain", settings.domain);
  if (settings.color) formData.append("color", settings.color);
  formData.append("theme", settings.theme);
  formData.append(
    "cvLanguage",
    settings.cvLanguage === "auto" ? uiLang : settings.cvLanguage,
  );

  return formData;
}
