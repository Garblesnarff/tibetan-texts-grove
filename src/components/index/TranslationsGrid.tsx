import { GroupedTranslation } from "@/types/groupedTranslation";
import TranslationViewer from "@/components/TranslationViewer";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";

interface TranslationsGridProps {
  translations: GroupedTranslation[];
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

/**
 * TranslationsGrid Component
 * Displays a grid of translation groups with loading and empty states
 * 
 * @param {Object} props - Component props
 * @param {GroupedTranslation[]} props.translations - Array of grouped translations to display
 * @param {Function} props.onDelete - Callback function to handle translation deletion
 * @param {boolean} props.isLoading - Loading state indicator
 * @returns {JSX.Element} Grid of translations or appropriate state component
 */
export const TranslationsGrid = ({ 
  translations, 
  onDelete, 
  isLoading 
}: TranslationsGridProps) => {
  /**
   * Renders the appropriate content based on loading and data state
   * @returns {JSX.Element} The content to display
   */
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (translations.length === 0) {
      return <EmptyState />;
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

  return renderContent();
};