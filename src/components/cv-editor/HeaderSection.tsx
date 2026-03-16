"use client";

import { HeaderData } from "@/lib/schemas/cv.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhotoUpload } from "./PhotoUpload";

interface Props {
  header: HeaderData;
  onChange: (header: HeaderData) => void;
  photoPreview: string;
  onPhotoChange: (file: File, preview: string) => void;
  onPhotoClear: () => void;
}

export function HeaderSection({
  header,
  onChange,
  photoPreview,
  onPhotoChange,
  onPhotoClear,
}: Props) {
  const update = (field: keyof HeaderData, value: string) => {
    onChange({ ...header, [field]: value });
  };

  const updateContact = (field: keyof HeaderData["contact"], value: string) => {
    onChange({ ...header, contact: { ...header.contact, [field]: value } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PhotoUpload
          preview={photoPreview}
          onChange={onPhotoChange}
          onClear={onPhotoClear}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input
              value={header.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Job Title</Label>
            <Input
              value={header.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Software Engineer"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Job Search Goal</Label>
            <Input
              value={header.jobSearchGoal}
              onChange={(e) => update("jobSearchGoal", e.target.value)}
              placeholder="Looking for..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Age</Label>
            <Input
              value={header.age}
              onChange={(e) => update("age", e.target.value)}
              placeholder="25 years old"
            />
          </div>
        </div>
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
            Contact
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                value={header.contact.email}
                onChange={(e) => updateContact("email", e.target.value)}
                placeholder="john@example.com"
                type="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                value={header.contact.phone}
                onChange={(e) => updateContact("phone", e.target.value)}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input
                value={header.contact.location}
                onChange={(e) => updateContact("location", e.target.value)}
                placeholder="Paris, France"
              />
            </div>
            <div className="space-y-1.5">
              <Label>LinkedIn</Label>
              <Input
                value={header.contact.linkedin}
                onChange={(e) => updateContact("linkedin", e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div className="space-y-1.5">
              <Label>GitHub</Label>
              <Input
                value={header.contact.github}
                onChange={(e) => updateContact("github", e.target.value)}
                placeholder="github.com/johndoe"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
