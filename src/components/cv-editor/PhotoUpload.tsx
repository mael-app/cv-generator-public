"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import Image from "next/image";

interface Props {
  preview: string;
  onChange: (file: File, preview: string) => void;
  onClear: () => void;
}

const MAX_SIZE = 5 * 1024 * 1024;

export function PhotoUpload({ preview, onChange, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > MAX_SIZE) {
      alert("Photo must be under 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
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
            alt="Profile photo"
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
          {preview ? "Change Photo" : "Upload Photo"}
        </Button>
        <p className="text-xs text-muted-foreground mt-1">
          JPEG, PNG or GIF — max 5MB
        </p>
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
