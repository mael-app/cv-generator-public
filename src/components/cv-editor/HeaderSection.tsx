"use client";

import { HeaderData } from "@/lib/schemas/cv.schema";
import { useT } from "@/context/LanguageContext";
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
  const { t } = useT();
  const th = t.editor.header;

  const update = (field: keyof HeaderData, value: string) => {
    onChange({ ...header, [field]: value });
  };

  const updateContact = (field: keyof HeaderData["contact"], value: string) => {
    onChange({ ...header, contact: { ...header.contact, [field]: value } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{th.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PhotoUpload
          preview={photoPreview}
          onChange={onPhotoChange}
          onClear={onPhotoClear}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>{th.name.label}</Label>
            <Input
              value={header.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder={th.name.placeholder}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{th.jobTitle.label}</Label>
            <Input
              value={header.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder={th.jobTitle.placeholder}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{th.jobSearchGoal.label}</Label>
            <Input
              value={header.jobSearchGoal}
              onChange={(e) => update("jobSearchGoal", e.target.value)}
              placeholder={th.jobSearchGoal.placeholder}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{th.age.label}</Label>
            <Input
              value={header.age}
              onChange={(e) => update("age", e.target.value)}
              placeholder={th.age.placeholder}
            />
          </div>
        </div>
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
            {th.contact.heading}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{th.contact.email.label}</Label>
              <Input
                value={header.contact.email}
                onChange={(e) => updateContact("email", e.target.value)}
                placeholder={th.contact.email.placeholder}
                type="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{th.contact.phone.label}</Label>
              <Input
                value={header.contact.phone}
                onChange={(e) => updateContact("phone", e.target.value)}
                placeholder={th.contact.phone.placeholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{th.contact.location.label}</Label>
              <Input
                value={header.contact.location}
                onChange={(e) => updateContact("location", e.target.value)}
                placeholder={th.contact.location.placeholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{th.contact.linkedin.label}</Label>
              <Input
                value={header.contact.linkedin}
                onChange={(e) => updateContact("linkedin", e.target.value)}
                placeholder={th.contact.linkedin.placeholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{th.contact.github.label}</Label>
              <Input
                value={header.contact.github}
                onChange={(e) => updateContact("github", e.target.value)}
                placeholder={th.contact.github.placeholder}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
