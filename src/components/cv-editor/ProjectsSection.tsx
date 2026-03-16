"use client";

import { ProjectData } from "@/lib/schemas/cv.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrayItemCard } from "./ArrayItemCard";
import { Plus } from "lucide-react";

interface Props {
  projects: ProjectData[];
  onChange: (projects: ProjectData[]) => void;
}

const newProject = (): ProjectData => ({
  title: "",
  stack: "",
  description: "",
});

export function ProjectsSection({ projects, onChange }: Props) {
  const update = (index: number, field: keyof ProjectData, value: string) => {
    onChange(
      projects.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Projects</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([...projects, newProject()])}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No projects yet
          </p>
        )}
        {projects.map((p, i) => (
          <ArrayItemCard
            key={i}
            title={p.title || `Project ${i + 1}`}
            onDelete={() => onChange(projects.filter((_, j) => j !== i))}
          >
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={p.title}
                onChange={(e) => update(i, "title", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stack</Label>
              <Input
                value={p.stack}
                onChange={(e) => update(i, "stack", e.target.value)}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={p.description}
                onChange={(e) => update(i, "description", e.target.value)}
                rows={2}
              />
            </div>
          </ArrayItemCard>
        ))}
      </CardContent>
    </Card>
  );
}
