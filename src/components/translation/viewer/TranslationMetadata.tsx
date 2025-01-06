import React from "react";
import { Translation } from "@/types/translation";

interface TranslationMetadataProps {
  translation: Translation;
}

export const TranslationMetadata = ({ translation }: TranslationMetadataProps) => {
  const code = translation?.title.split(' ')[0];
  
  return (
    <div className="mb-4">
      {code && <span className="text-sm text-muted-foreground">Code: {code}</span>}
    </div>
  );
};