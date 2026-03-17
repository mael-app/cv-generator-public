"use client";

import { EducationData } from "@/lib/schemas/cv.schema";
import { CVValidationErrors } from "@/lib/cv/cv-validation";
import { useT } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrayItemCard } from "./ArrayItemCard";
import { Plus } from "lucide-react";

interface Props {
  education: EducationData[];
  onChange: (education: EducationData[]) => void;
  errors?: CVValidationErrors["education"];
}

const newEdu = (): EducationData => ({
  degree: "",
  school: "",
  date: "",
  details: "",
});

export function EducationSection({ education, onChange, errors }: Props) {
  const { t } = useT();
  const te = t.editor.education;
  const tv = t.validation;

  const update = (index: number, field: keyof EducationData, value: string) => {
    onChange(
      education.map((e, i) => (i === index ? { ...e, [field]: value } : e)),
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{te.title}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([...education, newEdu()])}
        >
          <Plus className="h-4 w-4 mr-1" /> {te.add}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {education.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            {te.empty}
          </p>
        )}
        {education.map((edu, i) => (
          <ArrayItemCard
            key={i}
            title={edu.degree || edu.school || `Education ${i + 1}`}
            onDelete={() => onChange(education.filter((_, j) => j !== i))}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{te.degree}</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => update(i, "degree", e.target.value)}
                  className={
                    errors?.[i]?.degree
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {errors?.[i]?.degree && (
                  <p className="text-xs text-red-500">{tv.degreeRequired}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>{te.school}</Label>
                <Input
                  value={edu.school}
                  onChange={(e) => update(i, "school", e.target.value)}
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>{te.date.label}</Label>
                <Input
                  value={edu.date}
                  onChange={(e) => update(i, "date", e.target.value)}
                  placeholder={te.date.placeholder}
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>{te.details}</Label>
                <Textarea
                  value={edu.details}
                  onChange={(e) => update(i, "details", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </ArrayItemCard>
        ))}
      </CardContent>
    </Card>
  );
}
