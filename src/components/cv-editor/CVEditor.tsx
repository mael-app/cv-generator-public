"use client";

import { useState } from "react";
import { useCVStore } from "@/hooks/useCVStore";
import { useT } from "@/context/LanguageContext";
import {
  validateCVEssentials,
  hasValidationErrors,
  CVValidationErrors,
} from "@/lib/cv/cv-validation";
import {
  HeaderData,
  ExperienceData,
  EducationData,
} from "@/lib/schemas/cv.schema";
import { HeaderSection } from "./HeaderSection";
import { ExperiencesSection } from "./ExperiencesSection";
import { ProjectsSection } from "./ProjectsSection";
import { EducationSection } from "./EducationSection";
import { SkillsSection } from "./SkillsSection";
import { LanguagesSection } from "./LanguagesSection";
import { SoftSkillsSection } from "./SoftSkillsSection";
import { GenerateButton } from "@/components/generation/GenerateButton";
import { GenerationSettings } from "@/components/generation/GenerationSettings";
import { PreviewButton } from "@/components/generation/PreviewButton";
import { PreviewPanel } from "@/components/generation/PreviewPanel";
import { ExportButton } from "@/components/import-export/ExportButton";
import { ImportButton } from "@/components/import-export/ImportButton";
import { ClearButton } from "@/components/import-export/ClearButton";
import { Skeleton } from "@/components/ui/skeleton";

export function CVEditor() {
  const store = useCVStore();
  const { t } = useT();
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<CVValidationErrors>(
    {},
  );

  const validate = (): boolean => {
    const errors = validateCVEssentials(store.cv);
    setValidationErrors(errors);
    return !hasValidationErrors(errors);
  };

  const handleHeaderChange = (header: HeaderData) => {
    store.setCV((prev) => ({ ...prev, header }));
    setValidationErrors((prev) => ({ ...prev, header: undefined }));
  };

  const handleExperiencesChange = (experiences: ExperienceData[]) => {
    store.setCV((prev) => ({ ...prev, experiences }));
    setValidationErrors((prev) => ({ ...prev, experiences: undefined }));
  };

  const handleEducationChange = (education: EducationData[]) => {
    store.setCV((prev) => ({ ...prev, education }));
    setValidationErrors((prev) => ({ ...prev, education: undefined }));
  };

  if (!store.hydrated) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t.editor.title}</h1>
        <div className="flex gap-2 flex-wrap">
          <ImportButton onImport={store.setCV} />
          <ExportButton cv={store.cv} />
          <ClearButton onClear={store.clearAll} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-2 xl:col-span-3 space-y-6 min-w-0">
          <HeaderSection
            header={store.cv.header}
            onChange={handleHeaderChange}
            photoPreview={store.photoPreview}
            onPhotoChange={(file, preview) => {
              store.setPhotoFile(file);
              store.setPhotoPreview(preview);
            }}
            onPhotoClear={store.clearPhoto}
            errors={validationErrors.header}
          />
          <ExperiencesSection
            experiences={store.cv.experiences}
            onChange={handleExperiencesChange}
            errors={validationErrors.experiences}
          />
          <ProjectsSection
            projects={store.cv.projects}
            onChange={(projects) =>
              store.setCV((prev) => ({ ...prev, projects }))
            }
          />
          <EducationSection
            education={store.cv.education}
            onChange={handleEducationChange}
            errors={validationErrors.education}
          />
          <SkillsSection
            skills={store.cv.skills}
            onChange={(skills) => store.setCV((prev) => ({ ...prev, skills }))}
          />
          <LanguagesSection
            languages={store.cv.languages}
            onChange={(languages) =>
              store.setCV((prev) => ({ ...prev, languages }))
            }
          />
          <SoftSkillsSection
            softSkills={store.cv.softSkills}
            onChange={(softSkills) =>
              store.setCV((prev) => ({ ...prev, softSkills }))
            }
          />
        </div>

        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start min-w-0">
          <GenerationSettings
            settings={store.settings}
            onChange={store.setSettings}
          />
          <PreviewButton
            cv={store.cv}
            settings={store.settings}
            photoFile={store.photoFile}
            photoPreview={store.photoPreview}
            onPreview={setPreviewHtml}
            onValidate={validate}
          />
          <GenerateButton
            cv={store.cv}
            settings={store.settings}
            photoFile={store.photoFile}
            photoPreview={store.photoPreview}
            onValidate={validate}
          />
        </div>
      </div>

      {previewHtml && (
        <PreviewPanel html={previewHtml} onClose={() => setPreviewHtml(null)} />
      )}
    </div>
  );
}
