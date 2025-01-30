import { GroupedTranslation } from "@/types/groupedTranslation";
import TranslationViewer from "@/components/TranslationViewer";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { memo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TranslationsGridProps {
  translations: GroupedTranslation[];
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {translations.map((group) => (
          <motion.div
            key={group.code}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <TranslationViewer 
              translations={group.translations}
              onDelete={onDelete}
              searchQuery={searchQuery}
              showRelevance={showRelevance}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
});

TranslationsGrid.displayName = 'TranslationsGrid';