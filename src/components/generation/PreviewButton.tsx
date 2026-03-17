"use client";

import { useState } from "react";
import { CVData } from "@/lib/schemas/cv.schema";
import { CVSettings } from "@/hooks/useCVStore";
import { useT } from "@/context/LanguageContext";
import { buildCVFormData } from "@/lib/cv/build-form-data";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, AlertCircle } from "lucide-react";

interface Props {
  cv: CVData;
  settings: CVSettings;
  photoFile: File | null;
  photoPreview: string;
  onPreview: (html: string) => void;
  onValidate?: () => boolean;
}

export function PreviewButton({
  cv,
  settings,
  photoFile,
  photoPreview,
  onPreview,
  onValidate,
}: Props) {
  const { t, lang } = useT();
  const tg = t.generation;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const preview = async () => {
    if (onValidate && !onValidate()) return;
    setLoading(true);
    setError(false);
    try {
      const formData = buildCVFormData(
        cv,
        settings,
        photoFile,
        photoPreview,
        lang,
      );
      const response = await fetch("/api/preview", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error();
      onPreview(await response.text());
    } catch {
      setError(true);
      setTimeout(() => setError(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={preview}
        disabled={loading}
      >
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {error && <AlertCircle className="h-4 w-4 mr-2" />}
        {!loading && !error && <Eye className="h-4 w-4 mr-2" />}
        {loading ? tg.previewLoading : error ? tg.error : tg.preview}
      </Button>
      {error && (
        <p className="text-xs text-red-500 text-center">{tg.previewError}</p>
      )}
    </div>
  );
}
