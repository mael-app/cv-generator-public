"use client";

import { useT } from "@/context/LanguageContext";
import { TagsInput } from "./TagsInput";

interface Props {
  softSkills: string[];
  onChange: (softSkills: string[]) => void;
}

export function SoftSkillsSection({ softSkills, onChange }: Props) {
  const { t } = useT();
  const ts = t.editor.softSkills;
  return (
    <TagsInput
      title={ts.title}
      values={softSkills}
      onChange={onChange}
      placeholder={ts.placeholder}
      variant="list"
    />
  );
}
