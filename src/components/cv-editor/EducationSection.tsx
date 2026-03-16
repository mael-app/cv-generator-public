"use client";

import { EducationData } from "@/lib/schemas/cv.schema";
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
}

const newEdu = (): EducationData => ({
  degree: "",
  school: "",
  date: "",
  details: "",
});

export function EducationSection({ education, onChange }: Props) {
  const update = (index: number, field: keyof EducationData, value: string) => {
    onChange(
      education.map((e, i) => (i === index ? { ...e, [field]: value } : e)),
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Education</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([...education, newEdu()])}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {education.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No education yet
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
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => update(i, "degree", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>School</Label>
                <Input
                  value={edu.school}
                  onChange={(e) => update(i, "school", e.target.value)}
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Date</Label>
                <Input
                  value={edu.date}
                  onChange={(e) => update(i, "date", e.target.value)}
                  placeholder="2020 – 2023"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Details</Label>
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
