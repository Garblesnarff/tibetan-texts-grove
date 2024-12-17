import { Translation } from "@/types/translation";
import TranslationViewer from "@/components/TranslationViewer";
import { GroupedTranslation } from "@/types/groupedTranslation";

interface TranslationsGridProps {
  translations: GroupedTranslation[];
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

/**
 * Grid component for displaying translations
 * Handles both loading and empty states
 */
export const TranslationsGrid = ({ 
  translations, 
  onDelete, 
  isLoading 
}: TranslationsGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>Loading translations...</p>
      </div>
    );
  }

  if (translations.length === 0) {
    return (
      <p className="col-span-full text-center">
        No translations found. Use the upload button to add some!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {translations.map((group) => (
        <TranslationViewer 
          key={group.code} 
          translations={group.translations}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};