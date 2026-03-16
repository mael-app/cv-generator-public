"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface Props {
  title: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  /** "tags" renders pill badges, "list" renders a bullet list */
  variant?: "tags" | "list";
}

export function TagsInput({
  title,
  values,
  onChange,
  placeholder,
  variant = "tags",
}: Props) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setInput("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
          <Button variant="outline" size="icon" onClick={add}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {values.length > 0 && variant === "tags" && (
          <div className="flex flex-wrap gap-2">
            {values.map((value, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-medium"
              >
                {value}
                <button
                  onClick={() => onChange(values.filter((_, j) => j !== i))}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {values.length > 0 && variant === "list" && (
          <ul className="space-y-1">
            {values.map((value, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-muted/50"
              >
                <span>{value}</span>
                <button
                  onClick={() => onChange(values.filter((_, j) => j !== i))}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
