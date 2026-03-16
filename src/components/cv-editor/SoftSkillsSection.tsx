"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface Props {
  softSkills: string[];
  onChange: (softSkills: string[]) => void;
}

export function SoftSkillsSection({ softSkills, onChange }: Props) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !softSkills.includes(trimmed)) {
      onChange([...softSkills, trimmed]);
      setInput("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Soft Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Leadership, Communication..."
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
        {softSkills.length > 0 && (
          <ul className="space-y-1">
            {softSkills.map((skill, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-muted/50"
              >
                <span>{skill}</span>
                <button
                  onClick={() => onChange(softSkills.filter((_, j) => j !== i))}
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
