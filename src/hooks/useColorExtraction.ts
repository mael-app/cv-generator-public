"use client";

import { useState, useEffect, useRef } from "react";

export function useColorExtraction(domain: string, forcedColor: string) {
  const [extractedColor, setExtractedColor] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (forcedColor) {
      setExtractedColor(forcedColor);
      return;
    }
    if (!domain.trim()) {
      setExtractedColor("");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/color?domain=${encodeURIComponent(domain)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setExtractedColor(data.color);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [domain, forcedColor]);

  return { color: extractedColor || "#005eb8", loading };
}
