"use client";

import { ExperienceData } from "@/lib/schemas/cv.schema";
import { CVValidationErrors } from "@/lib/cv/cv-validation";
import { useT } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrayItemCard } from "./ArrayItemCard";
import { Plus, X } from "lucide-react";

interface Props {
  experiences: ExperienceData[];
  onChange: (experiences: ExperienceData[]) => void;
  errors?: CVValidationErrors["experiences"];
}

const newExp = (): ExperienceData => ({
  role: "",
  company: "",
  date: "",
  description: "",
  tasks: [""],
});

export function ExperiencesSection({ experiences, onChange, errors }: Props) {
  const { t } = useT();
  const te = t.editor.experiences;
  const tv = t.validation;

  const update = (
    index: number,
    field: keyof ExperienceData,
    value: string | string[],
  ) => {
    onChange(
      experiences.map((e, i) => (i === index ? { ...e, [field]: value } : e)),
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{te.title}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([...experiences, newExp()])}
        >
          <Plus className="h-4 w-4 mr-1" /> {te.add}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {experiences.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            {te.empty}
          </p>
        )}
        {experiences.map((exp, i) => (
          <ArrayItemCard
            key={i}
            title={exp.role || exp.company || `Experience ${i + 1}`}
            onDelete={() => onChange(experiences.filter((_, j) => j !== i))}
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{te.role}</Label>
                <Input
                  value={exp.role}
                  onChange={(e) => update(i, "role", e.target.value)}
                  className={
                    errors?.[i]?.role
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {errors?.[i]?.role && (
                  <p className="text-xs text-red-500">{tv.roleRequired}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>{te.company}</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => update(i, "company", e.target.value)}
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>{te.date.label}</Label>
                <Input
                  value={exp.date}
                  onChange={(e) => update(i, "date", e.target.value)}
                  placeholder={te.date.placeholder}
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>{te.description}</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => update(i, "description", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{te.tasks.label}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => update(i, "tasks", [...exp.tasks, ""])}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> {te.tasks.add}
                </Button>
              </div>
              {exp.tasks.map((task, ti) => (
                <div key={ti} className="flex gap-2">
                  <Input
                    value={task}
                    onChange={(e) => {
                      const tasks = exp.tasks.map((t, j) =>
                        j === ti ? e.target.value : t,
                      );
                      update(i, "tasks", tasks);
                    }}
                    placeholder={te.tasks.placeholder}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() =>
                      update(
                        i,
                        "tasks",
                        exp.tasks.filter((_, j) => j !== ti),
                      )
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ArrayItemCard>
        ))}
      </CardContent>
    </Card>
  );
}
