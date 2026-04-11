"use client";

import { CVSettings, CVLanguage } from "@/hooks/useCVStore";
import { useT } from "@/context/LanguageContext";
import { useColorExtraction } from "@/hooks/useColorExtraction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColorPreview } from "./ColorPreview";
import type { CvTemplate } from "@/lib/pdf/renderer";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  settings: CVSettings;
  onChange: (settings: CVSettings) => void;
}

function TemplateThumbnail({
  template,
  className,
}: {
  template: CvTemplate;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-md border bg-muted/20 overflow-hidden shadow-sm aspect-[1/1.414]",
        className,
      )}
    >
      <Image
        src={`/templates/${template}.png`}
        alt={`Preview of ${template} template`}
        className="w-full h-full object-cover object-top"
        loading="lazy"
        width={400}
        height={565}
      />
    </div>
  );
}

export function GenerationSettings({ settings, onChange }: Props) {
  const { t } = useT();
  const tg = t.generation;
  const { color, loading } = useColorExtraction(
    settings.domain,
    settings.color,
  );
  const currentTemplateLabel =
    tg.cvTemplate.options.find(({ value }) => value === settings.cvTemplate)
      ?.label ?? settings.cvTemplate;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{tg.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>{tg.domain.label}</Label>
          <Input
            value={settings.domain}
            onChange={(e) => onChange({ ...settings, domain: e.target.value })}
            placeholder={tg.domain.placeholder}
          />
          <p className="text-xs text-muted-foreground">{tg.domain.hint}</p>
        </div>
        <div className="space-y-1.5">
          <Label>{tg.colorOverride.label}</Label>
          <div className="flex gap-2 items-center">
            <Input
              value={settings.color}
              onChange={(e) => onChange({ ...settings, color: e.target.value })}
              placeholder={tg.colorOverride.placeholder}
              className="font-mono"
            />
            <input
              type="color"
              value={settings.color || color}
              onChange={(e) => onChange({ ...settings, color: e.target.value })}
              className="h-9 w-9 rounded border cursor-pointer"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>{tg.activeColor}</Label>
          <ColorPreview color={color} loading={loading} />
        </div>
        <div className="space-y-1.5">
          <Label>{tg.theme.label}</Label>
          <Select
            value={settings.theme}
            onValueChange={(v) =>
              onChange({ ...settings, theme: v as "light" | "dark" })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{tg.theme.light}</SelectItem>
              <SelectItem value="dark">{tg.theme.dark}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{tg.cvLanguage.label}</Label>
          <Select
            value={settings.cvLanguage}
            onValueChange={(v) =>
              onChange({ ...settings, cvLanguage: v as CVLanguage })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">{tg.cvLanguage.auto}</SelectItem>
              {tg.cvLanguage.options.map(({ value, flag, label }) => (
                <SelectItem key={value} value={value}>
                  {flag} {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{tg.cvTemplate.label}</Label>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex h-auto w-full flex-col items-center gap-2 p-3"
              >
                <TemplateThumbnail
                  template={settings.cvTemplate}
                  className="w-full max-w-[150px] shrink-0 rounded-sm"
                />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {tg.cvTemplate.current}
                  </p>
                  <p className="text-sm font-medium">{currentTemplateLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {tg.cvTemplate.openGallery}
                  </p>
                </div>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-5xl overflow-hidden p-0">
              <DialogHeader className="border-b px-6 py-4">
                <DialogTitle>{tg.cvTemplate.galleryTitle}</DialogTitle>
                <DialogDescription>
                  {tg.cvTemplate.galleryHint}
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[70vh] overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {tg.cvTemplate.options.map(({ value, label }) => {
                    const template = value as CvTemplate;
                    const selected = settings.cvTemplate === template;

                    return (
                      <DialogClose asChild key={value}>
                        <button
                          type="button"
                          className={cn(
                            "flex flex-col items-center rounded-xl border bg-muted/20 p-4 text-center transition-all hover:bg-muted/60",
                            selected &&
                              "border-primary bg-primary/5 ring-2 ring-primary/25",
                          )}
                          onClick={() =>
                            onChange({ ...settings, cvTemplate: template })
                          }
                        >
                          <TemplateThumbnail
                            template={template}
                            className="w-full overflow-hidden rounded-md border shadow-sm"
                          />
                          <div className="mt-4 text-lg font-medium">
                            {label}
                          </div>
                        </button>
                      </DialogClose>
                    );
                  })}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
