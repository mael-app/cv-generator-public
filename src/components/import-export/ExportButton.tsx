"use client";

import { CVData } from "@/lib/schemas/cv.schema";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Props {
  cv: CVData;
}

export function ExportButton({ cv }: Props) {
  const handleExport = () => {
    const json = JSON.stringify(cv, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv-data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="h-4 w-4 mr-1.5" />
      Export JSON
    </Button>
  );
}
