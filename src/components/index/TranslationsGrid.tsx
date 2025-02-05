import { Translation } from "@/types/translation";
import TranslationViewer from "@/components/TranslationViewer";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { memo, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TranslationsGridProps {
  translations: Translation[];
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
  searchQuery?: string;
  activeCategory?: string;
  error?: Error;
  showRelevance?: boolean;
}

export const TranslationsGrid = memo(({ 
  translations, 
  onDelete, 
  isLoading,
  searchQuery,
  activeCategory,
  error,
  showRelevance = false
}: TranslationsGridProps) => {
  const handleTranslationUpdate = useCallback(async (updatedTranslation: Translation) => {
    // Find and update the translation in the local state
    const updatedTranslations = translations.map(t => 
      t.id === updatedTranslation.id ? updatedTranslation : t
    );
    
    // Trigger a re-render with the updated translations
    return updatedTranslations;
  }, [translations]);

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
    <AnimatePresence mode="wait">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {translations.map((translation) => (
          <motion.div
            key={translation.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="group"
          >
            <TranslationViewer 
              translations={[translation]}
              onDelete={onDelete}
              searchQuery={searchQuery}
              showRelevance={showRelevance}
              onUpdate={handleTranslationUpdate}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
});

TranslationsGrid.displayName = 'TranslationsGrid';