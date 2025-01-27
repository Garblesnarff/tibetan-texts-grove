import { GroupedTranslation } from "@/types/groupedTranslation";
import TranslationViewer from "@/components/TranslationViewer";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { memo } from "react";

interface TranslationsGridProps {
  translations: GroupedTranslation[];
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
  searchQuery?: string;
  activeCategory?: string;
}

export const TranslationsGrid = memo(({ 
  translations, 
  onDelete, 
  isLoading,
  searchQuery,
  activeCategory
}: TranslationsGridProps) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (translations.length === 0) {
      return (
        <EmptyState 
          isSearching={!!searchQuery} 
          searchQuery={searchQuery}
          activeCategory={activeCategory}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {translations.map((group) => (
          <TranslationViewer 
            key={group.code} 
            translations={group.translations}
            onDelete={onDelete}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    );
  };

  return renderContent();
});

TranslationsGrid.displayName = 'TranslationsGrid';