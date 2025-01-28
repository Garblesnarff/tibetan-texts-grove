import { GroupedTranslation } from "@/types/groupedTranslation";
import TranslationViewer from "@/components/TranslationViewer";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { memo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TranslationsGridProps {
  translations: GroupedTranslation[];
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
  searchQuery?: string;
  activeCategory?: string;
  error?: Error;
}

export const TranslationsGrid = memo(({ 
  translations, 
  onDelete, 
  isLoading,
  searchQuery,
  activeCategory,
  error
}: TranslationsGridProps) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-2xl my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load translations. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
});

TranslationsGrid.displayName = 'TranslationsGrid';