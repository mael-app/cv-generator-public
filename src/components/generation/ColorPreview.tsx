"use client";

import { useT } from "@/context/LanguageContext";

interface Props {
  color: string;
  loading: boolean;
}

export function ColorPreview({ color, loading }: Props) {
  const { t } = useT();

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-full border border-border transition-colors"
        style={{ backgroundColor: loading ? "#e2e8f0" : color }}
      />
      <span className="text-sm font-mono text-muted-foreground">
        {loading ? t.generation.detecting : color}
      </span>
    </div>
  );
}
