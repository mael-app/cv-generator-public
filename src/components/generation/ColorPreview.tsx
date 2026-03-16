"use client";

interface Props {
  color: string;
  loading: boolean;
}

export function ColorPreview({ color, loading }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-full border border-border transition-colors"
        style={{ backgroundColor: loading ? "#e2e8f0" : color }}
      />
      <span className="text-sm font-mono text-muted-foreground">
        {loading ? "Detecting..." : color}
      </span>
    </div>
  );
}
