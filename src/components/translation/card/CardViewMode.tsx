import React from "react";
import CardTitleDisplay from "./CardTitleDisplay";
import { TranslationMetadata } from "../TranslationMetadata";

interface CardViewModeProps {
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
  searchQuery?: string;
  viewCount: number;
  featured: boolean;
  updatedAt: string;
  createdAt: string;
  tags: string[];
}

export const CardViewMode = ({
  englishTitle,
  tibetanTitle,
  originalTibetanFileName,
  searchQuery,
  viewCount,
  featured,
  updatedAt,
  createdAt,
  tags,
}: CardViewModeProps) => {
  return (
    <>
      <CardTitleDisplay
        englishTitle={englishTitle}
        tibetanTitle={tibetanTitle}
        originalTibetanFileName={originalTibetanFileName}
        searchQuery={searchQuery}
      />
      <div className="mt-2">
        <TranslationMetadata
          viewCount={viewCount}
          featured={featured}
          updatedAt={updatedAt}
          createdAt={createdAt}
          tags={tags}
        />
      </div>
    </>
  );
};