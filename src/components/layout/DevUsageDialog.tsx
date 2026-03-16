"use client";

import { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

const BASE_URL =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : "http://localhost:3000";

const CURL_COMMAND = `curl -X POST ${BASE_URL}/api/generate \\
  -F "cv=<cv-data.json" \\
  -F "photo=@photo.jpg" \\
  -F "domain=apple.com" \\
  -F "color=#005eb8" \\
  -F "theme=light" \\
  -o cv.pdf`;

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-md bg-muted border">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-7 w-7 text-muted-foreground hover:text-foreground"
        onClick={copy}
        aria-label="Copy"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
      <pre className="overflow-x-auto p-4 pr-10 text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function DevUsageDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Terminal className="h-3.5 w-3.5" />
          API
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>API Usage</DialogTitle>
          <DialogDescription>
            Generate CVs programmatically via HTTP — no auth required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <CodeBlock code={CURL_COMMAND} />

          <div className="space-y-2 text-muted-foreground">
            <p className="font-medium text-foreground">Parameters</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded self-start">
                cv
              </code>
              <span>JSON file matching the CV schema — required</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded self-start">
                photo
              </code>
              <span>Profile photo (JPEG / PNG / GIF, max 5 MB) — optional</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded self-start">
                domain
              </code>
              <span>
                Company domain for brand color extraction (e.g.{" "}
                <em>apple.com</em>) — optional
              </span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded self-start">
                color
              </code>
              <span>
                Hex color override, takes precedence over domain (e.g.{" "}
                <em>#005eb8</em>) — optional
              </span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded self-start">
                theme
              </code>
              <span>
                <em>light</em> or <em>dark</em> — default: light
              </span>
            </div>
          </div>

          <div className="space-y-2 text-muted-foreground">
            <p className="font-medium text-foreground">Response</p>
            <p>
              Returns the PDF binary directly as{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                application/pdf
              </code>
              . On error, returns JSON with an{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                error
              </code>{" "}
              field.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
