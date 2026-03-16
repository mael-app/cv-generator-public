"use client";

import { useRef } from "react";
import { useT } from "@/context/LanguageContext";
import { MAX_PHOTO_SIZE } from "@/lib/cv/constants";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import Image from "next/image";

interface Props {
  preview: string;
  onChange: (file: File, preview: string) => void;
  onClear: () => void;
}

export function PhotoUpload({ preview, onChange, onClear }: Props) {
  const { t } = useT();
  const tp = t.editor.photo;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > MAX_PHOTO_SIZE) {
      alert(tp.tooLarge);
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert(tp.invalidType);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(file, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4">
      {preview ? (
        <div className="relative">
          <Image
            src={preview}
            alt={tp.alt}
            width={80}
            height={80}
            className="rounded-full object-cover border-2 border-border"
            style={{ width: 80, height: 80 }}
          />
          <button
            onClick={onClear}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          {preview ? tp.change : tp.upload}
        </Button>
        <p className="text-xs text-muted-foreground mt-1">{tp.hint}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
