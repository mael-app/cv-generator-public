"use client";

import { useCVStore } from "@/hooks/useCVStore";
import { HeaderSection } from "./HeaderSection";
import { ExperiencesSection } from "./ExperiencesSection";
import { ProjectsSection } from "./ProjectsSection";
import { EducationSection } from "./EducationSection";
import { SkillsSection } from "./SkillsSection";
import { LanguagesSection } from "./LanguagesSection";
import { SoftSkillsSection } from "./SoftSkillsSection";
import { GenerateButton } from "@/components/generation/GenerateButton";
import { GenerationSettings } from "@/components/generation/GenerationSettings";
import { ExportButton } from "@/components/import-export/ExportButton";
import { ImportButton } from "@/components/import-export/ImportButton";
import { Skeleton } from "@/components/ui/skeleton";

export function CVEditor() {
  const store = useCVStore();

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
        <h1 className="text-2xl font-bold">CV Editor</h1>
        <div className="flex gap-2 flex-wrap">
          <ImportButton onImport={store.setCV} />
          <ExportButton cv={store.cv} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-2 xl:col-span-3 space-y-6 min-w-0">
          <HeaderSection
            header={store.cv.header}
            onChange={(header) => store.setCV((prev) => ({ ...prev, header }))}
            photoPreview={store.photoPreview}
            onPhotoChange={(file, preview) => {
              store.setPhotoFile(file);
              store.setPhotoPreview(preview);
            }}
            onPhotoClear={store.clearPhoto}
          />
          <ExperiencesSection
            experiences={store.cv.experiences}
            onChange={(experiences) =>
              store.setCV((prev) => ({ ...prev, experiences }))
            }
          />
          <ProjectsSection
            projects={store.cv.projects}
            onChange={(projects) =>
              store.setCV((prev) => ({ ...prev, projects }))
            }
          />
          <EducationSection
            education={store.cv.education}
            onChange={(education) =>
              store.setCV((prev) => ({ ...prev, education }))
            }
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
          <GenerateButton
            cv={store.cv}
            settings={store.settings}
            photoFile={store.photoFile}
            photoPreview={store.photoPreview}
          />
        </div>
      </div>
    </div>
  );
}
