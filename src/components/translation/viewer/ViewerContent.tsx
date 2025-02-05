import React from "react";
import { Translation } from "@/types/translation";
import TranslationCard from "../TranslationCard";
import { VersionHistory } from "./VersionHistory";
import { TranslationMetadata } from "./TranslationMetadata";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ViewerContentProps {
  currentTranslation: Translation;
  translationId: string;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  searchQuery?: string;
  onUpdate: () => Promise<void>;
  currentVersion: any;
  onVersionSelect: (version: any) => void;
  isUpdating?: boolean;
}

export const ViewerContent = ({
  currentTranslation,
  translationId,
  isEditing,
  onEditingChange,
  searchQuery,
  onUpdate,
  currentVersion,
  onVersionSelect,
  isUpdating = false,
}: ViewerContentProps) => {
  const { isAdmin } = useAuth();
  
  // Safely extract code from title with fallback
  const code = currentTranslation?.title 
    ? currentTranslation.title.split(' ')[0] || ''
    : '';

  return (
    <div className="pt-10 relative">
      {isUpdating && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <TranslationMetadata 
        view_count={currentTranslation?.view_count || 0}
        featured={currentTranslation?.featured || false}
        created_at={currentTranslation?.created_at || new Date().toISOString()}
      />
      <TranslationCard
        code={code}
        englishTitle={currentTranslation?.title || ''}
        tibetanTitle={currentTranslation?.tibetan_title}
        originalTibetanFileName={
          currentTranslation?.metadata && 
          typeof currentTranslation.metadata === 'object' && 
          'originalTibetanFileName' in currentTranslation.metadata
            ? (currentTranslation.metadata as { originalTibetanFileName?: string }).originalTibetanFileName
            : undefined
        }
        description={currentTranslation?.description}
        translationId={translationId}
        onUpdate={onUpdate}
        isEditing={isEditing}
        onEditingChange={onEditingChange}
        searchQuery={searchQuery}
        tags={currentTranslation?.tags || []}
        view_count={currentTranslation?.view_count}
        featured={currentTranslation?.featured}
        updated_at={currentTranslation?.updated_at}
        created_at={currentTranslation?.created_at}
        isUpdating={isUpdating}
      />
      {!isEditing && isAdmin && (
        <div className="mt-6">
          <VersionHistory
            translationId={translationId}
            currentVersion={currentVersion}
            onVersionSelect={onVersionSelect}
          />
        </div>
      )}
    </div>
  );
};