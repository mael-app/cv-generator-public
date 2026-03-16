"use client";

import { useRef } from "react";
import { CVData, CVSchema } from "@/lib/schemas/cv.schema";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface Props {
  onImport: (cv: CVData) => void;
}

export function ImportButton({ onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const result = CVSchema.safeParse(json);
      if (!result.success) {
        alert(
          "Invalid CV data: " +
            result.error.issues.map((i) => i.message).join(", "),
        );
        return;
      }
      onImport(result.data);
    } catch {
      alert("Failed to parse JSON file");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4 mr-1.5" />
        Import JSON
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </>
  );
}
