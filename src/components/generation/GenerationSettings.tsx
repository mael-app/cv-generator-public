"use client";

import { CVSettings } from "@/hooks/useCVStore";
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

interface Props {
  settings: CVSettings;
  onChange: (settings: CVSettings) => void;
}

export function GenerationSettings({ settings, onChange }: Props) {
  const { color, loading } = useColorExtraction(
    settings.domain,
    settings.color,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Generation Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Company Domain</Label>
          <Input
            value={settings.domain}
            onChange={(e) => onChange({ ...settings, domain: e.target.value })}
            placeholder="apple.com"
          />
          <p className="text-xs text-muted-foreground">
            Used for brand color extraction
          </p>
        </div>
        <div className="space-y-1.5">
          <Label>Color override</Label>
          <div className="flex gap-2 items-center">
            <Input
              value={settings.color}
              onChange={(e) => onChange({ ...settings, color: e.target.value })}
              placeholder="#005eb8"
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
          <Label>Active Color</Label>
          <ColorPreview color={color} loading={loading} />
        </div>
        <div className="space-y-1.5">
          <Label>PDF Theme</Label>
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
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
