"use client";

import { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { useT } from "@/context/LanguageContext";
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
  const { t } = useT();
  const ta = t.api;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Terminal className="h-3.5 w-3.5" />
          {ta.button}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ta.title}</DialogTitle>
          <DialogDescription>{ta.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <CodeBlock code={CURL_COMMAND} />

          <div className="space-y-2 text-muted-foreground">
            <p className="font-medium text-foreground">{ta.parameters}</p>
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded self-start">
                cv
              </code>
              <span>{ta.params.cv}</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded self-start">
                photo
              </code>
              <span>{ta.params.photo}</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded self-start">
                domain
              </code>
              <span>{ta.params.domain}</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded self-start">
                color
              </code>
              <span>{ta.params.color}</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded self-start">
                theme
              </code>
              <span>{ta.params.theme}</span>
            </div>
          </div>

          <div className="space-y-2 text-muted-foreground">
            <p className="font-medium text-foreground">{ta.response}</p>
            <p>{ta.responseDesc}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
