"use client";

import { useState } from "react";
import { CVData } from "@/lib/schemas/cv.schema";
import { CVSettings } from "@/hooks/useCVStore";
import { useT } from "@/context/LanguageContext";
import { buildCVFormData } from "@/lib/cv/build-form-data";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  cv: CVData;
  settings: CVSettings;
  photoFile: File | null;
  photoPreview: string;
}

type Status = "idle" | "generating" | "success" | "error";

export function GenerateButton({
  cv,
  settings,
  photoFile,
  photoPreview,
}: Props) {
  const { t, lang } = useT();
  const tg = t.generation;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const generate = async () => {
    setStatus("generating");
    setErrorMsg("");

    try {
      const formData = buildCVFormData(
        cv,
        settings,
        photoFile,
        photoPreview,
        lang,
      );
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || tg.generateError);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = settings.domain ? `cv-${settings.domain}.pdf` : "cv.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        size="lg"
        onClick={generate}
        disabled={status === "generating"}
      >
        {status === "generating" && (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        )}
        {status === "success" && <CheckCircle className="h-4 w-4 mr-2" />}
        {status === "error" && <AlertCircle className="h-4 w-4 mr-2" />}
        {status === "idle" && <FileDown className="h-4 w-4 mr-2" />}
        {status === "generating"
          ? tg.generating
          : status === "success"
            ? tg.downloaded
            : status === "error"
              ? tg.error
              : tg.generate}
      </Button>
      {status === "error" && (
        <p className="text-xs text-red-500 text-center">{errorMsg}</p>
      )}
    </div>
  );
}
