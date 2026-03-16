"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  html: string;
  onClose: () => void;
}

const CV_WIDTH = 794; // A4 at 96 dpi

export function PreviewPanel({ html, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [iframeHeight, setIframeHeight] = useState(1123);

  // Scale iframe to fit container width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setScale(Math.min(width / CV_WIDTH, 1));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll into view on open
  useEffect(() => {
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const handleLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const height =
        e.currentTarget.contentDocument?.documentElement.scrollHeight;
      if (height) setIframeHeight(height);
    } catch {}
  };

  return (
    <div className="border rounded-lg overflow-hidden" ref={containerRef}>
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <span className="text-sm font-medium">Preview</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="w-full bg-gray-100 dark:bg-zinc-800 p-4 flex justify-center">
        <div
          style={{
            width: CV_WIDTH * scale,
            height: iframeHeight * scale,
          }}
        >
          <iframe
            srcDoc={html}
            title="CV Preview"
            onLoad={handleLoad}
            style={{
              width: CV_WIDTH,
              height: iframeHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              border: "none",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}
