"use client";

import { useRef, useState } from "react";
import { CVData, CVSchema } from "@/lib/schemas/cv.schema";
import { useT } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileJson } from "lucide-react";

interface Props {
  onImport: (cv: CVData) => void;
}

function parseAndValidate(
  raw: string,
  errorSyntax: string,
): { data: CVData } | { error: string } {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { error: errorSyntax };
  }
  const result = CVSchema.safeParse(json);
  if (!result.success) {
    const messages = result.error.issues
      .map((i) => `• ${i.path.join(".") || "root"}: ${i.message}`)
      .join("\n");
    return { error: messages };
  }
  return { data: result.data };
}

export function ImportButton({ onImport }: Props) {
  const { t } = useT();
  const ti = t.importExport.import;
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePasteImport = () => {
    const result = parseAndValidate(text, ti.errorSyntax);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    onImport(result.data);
    setOpen(false);
    setText("");
    setError(null);
  };

  const handleFile = async (file: File) => {
    const raw = await file.text();
    const result = parseAndValidate(raw, ti.errorSyntax);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    onImport(result.data);
    setOpen(false);
    setText("");
    setError(null);
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setText("");
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-1.5" />
          {ti.button}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{ti.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">{ti.pasteLabel}</p>
            <Textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError(null);
              }}
              placeholder={ti.placeholder}
              className="font-mono text-xs min-h-48 resize-y"
              spellCheck={false}
            />
          </div>

          {error && (
            <pre className="text-xs text-red-500 bg-red-500/10 rounded-md p-3 whitespace-pre-wrap break-words">
              {error}
            </pre>
          )}

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1.5"
              onClick={() => inputRef.current?.click()}
            >
              <FileJson className="h-4 w-4" />
              {ti.fromFile}
            </Button>
            <Button onClick={handlePasteImport} disabled={!text.trim()}>
              {ti.submit}
            </Button>
          </div>
        </div>

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
      </DialogContent>
    </Dialog>
  );
}
