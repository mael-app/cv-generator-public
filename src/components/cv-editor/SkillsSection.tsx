"use client";

import { useT } from "@/context/LanguageContext";
import { TagsInput } from "./TagsInput";

interface Props {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsSection({ skills, onChange }: Props) {
  const { t } = useT();
  const ts = t.editor.skills;
  return (
    <TagsInput
      title={ts.title}
      values={skills}
      onChange={onChange}
      placeholder={ts.placeholder}
      variant="tags"
    />
  );
}
