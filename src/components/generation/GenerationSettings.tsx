"use client";

import { CVSettings, CVLanguage } from "@/hooks/useCVStore";
import { useT } from "@/context/LanguageContext";
import { useColorExtraction } from "@/hooks/useColorExtraction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPreview } from "./ColorPreview";
import { CvTemplate } from "@/lib/pdf/renderer";

interface Props {
  settings: CVSettings;
  onChange: (settings: CVSettings) => void;
}

export function GenerationSettings({ settings, onChange }: Props) {
  const { t } = useT();
  const tg = t.generation;
  const { color, loading } = useColorExtraction(
    settings.domain,
    settings.color,
  );

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
          <Select
            value={settings.cvTemplate}
            onValueChange={(v) =>
              onChange({ ...settings, cvTemplate: v as CvTemplate })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tg.cvTemplate.options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
