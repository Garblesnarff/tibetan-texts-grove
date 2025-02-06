import { Translation } from "@/types/translation";
import TranslationViewer from "@/components/TranslationViewer";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { memo, useCallback, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

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
  translations: initialTranslations, 
  onDelete, 
  isLoading,
  searchQuery,
  activeCategory,
  error,
  showRelevance = false
}: TranslationsGridProps) => {
  const [translations, setTranslations] = useState(initialTranslations);
  const { toast } = useToast();

  const handleTranslationUpdate = useCallback(async (updatedTranslation: Translation): Promise<void> => {
    try {
      setTranslations(prevTranslations => 
        prevTranslations.map(t => 
          t.id === updatedTranslation.id ? updatedTranslation : t
        )
      );
    } catch (error) {
      console.error('Error updating translation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update translation in grid",
      });
    }
  }, [toast]);

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