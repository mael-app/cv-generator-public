"use client";

import { LanguageData } from "@/lib/schemas/cv.schema";
import { useT } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

interface Props {
  languages: LanguageData[];
  onChange: (languages: LanguageData[]) => void;
}

export function LanguagesSection({ languages, onChange }: Props) {
  const { t } = useT();
  const tl = t.editor.languages;

  const update = (index: number, field: keyof LanguageData, value: string) => {
    onChange(
      languages.map((l, i) => (i === index ? { ...l, [field]: value } : l)),
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{tl.title}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([...languages, { name: "", level: "" }])}
        >
          <Plus className="h-4 w-4 mr-1" /> {tl.add}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {languages.map((lang, i) => (
          <div key={i} className="flex gap-3 items-end">
            <div className="flex-1 space-y-1.5">
              <Label>{tl.name.label}</Label>
              <Input
                value={lang.name}
                onChange={(e) => update(i, "name", e.target.value)}
                placeholder={tl.name.placeholder}
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label>{tl.level.label}</Label>
              <Input
                value={lang.level}
                onChange={(e) => update(i, "level", e.target.value)}
                placeholder={tl.level.placeholder}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => onChange(languages.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {languages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            {tl.empty}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
