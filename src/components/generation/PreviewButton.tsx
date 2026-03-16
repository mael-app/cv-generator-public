"use client";

import { useState } from "react";
import { CVData } from "@/lib/schemas/cv.schema";
import { CVSettings } from "@/hooks/useCVStore";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";

interface Props {
  cv: CVData;
  settings: CVSettings;
  photoFile: File | null;
  photoPreview: string;
  onPreview: (html: string) => void;
}

export function PreviewButton({
  cv,
  settings,
  photoFile,
  photoPreview,
  onPreview,
}: Props) {
  const [loading, setLoading] = useState(false);

  const preview = async () => {
    setLoading(true);
    try {
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
        formData.append(
          "photo",
          new Blob([bytes], { type: mime }),
          "photo.jpg",
        );
      }

      if (settings.domain) formData.append("domain", settings.domain);
      if (settings.color) formData.append("color", settings.color);
      formData.append("theme", settings.theme);

      const response = await fetch("/api/preview", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Preview failed");

      onPreview(await response.text());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={preview}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Eye className="h-4 w-4 mr-2" />
      )}
      {loading ? "Loading preview..." : "Preview"}
    </Button>
  );
}
