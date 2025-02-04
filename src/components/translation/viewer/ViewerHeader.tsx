import React from "react";
import { Translation } from "@/types/translation";
import { TranslationMetadata } from "./TranslationMetadata";

interface ViewerHeaderProps {
  translation: Translation;
}

export const ViewerHeader = ({ translation }: ViewerHeaderProps) => {
  return (
    <div className="mb-6">
      <TranslationMetadata
        view_count={translation.view_count || 0}
        featured={translation.featured || false}
        created_at={translation.created_at || new Date().toISOString()}
      />
    </div>
  );
};