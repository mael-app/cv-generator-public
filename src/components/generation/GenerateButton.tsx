"use client";

import { useState } from "react";
import { CVData } from "@/lib/schemas/cv.schema";
import { CVSettings } from "@/hooks/useCVStore";
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
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const generate = async () => {
    setStatus("generating");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("cv", JSON.stringify(cv));

      // Use photoFile if available, otherwise convert photoPreview to blob
      if (photoFile) {
        formData.append("photo", photoFile);
      } else if (photoPreview) {
        const res = await fetch(photoPreview);
        const blob = await res.blob();
        formData.append("photo", blob, "photo.jpg");
      }

      if (settings.domain) formData.append("domain", settings.domain);
      if (settings.color) formData.append("color", settings.color);
      formData.append("theme", settings.theme);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      const { downloadUrl } = await response.json();

      // Trigger download
      const dlResponse = await fetch(downloadUrl);
      if (!dlResponse.ok) throw new Error("Download failed");

      const blob = await dlResponse.blob();
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
          ? "Generating PDF..."
          : status === "success"
            ? "Downloaded!"
            : status === "error"
              ? "Error"
              : "Generate PDF"}
      </Button>
      {status === "error" && (
        <p className="text-xs text-destructive text-center">{errorMsg}</p>
      )}
    </div>
  );
}
