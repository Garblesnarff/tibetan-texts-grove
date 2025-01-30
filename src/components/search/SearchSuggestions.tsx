import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CorrectionSuggestions } from "./suggestions/CorrectionSuggestions";
import { RelatedSearches } from "./suggestions/RelatedSearches";
import { SearchHistory } from "./suggestions/SearchHistory";

interface SearchSuggestionsProps {
  searchQuery: string;
  suggestions: Array<{
    id: string;
    suggested_term: string;
    type: 'correction' | 'related';
  }>;
  history: Array<{ term: string; timestamp: number }>;
  isLoading: boolean;
  onSelect: (term: string) => void;
  onClearHistory: () => void;
  onClearHistoryItem: (term: string) => void;
  visible: boolean;
}

export function SearchSuggestions({
  searchQuery,
  suggestions,
  history,
  isLoading,
  onSelect,
  onClearHistory,
  onClearHistoryItem,
  visible
}: SearchSuggestionsProps) {
  if (!visible) return null;

  const corrections = suggestions.filter(s => s.type === 'correction');
  const relatedSearches = suggestions.filter(s => s.type === 'related');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 rounded-lg border bg-background shadow-lg z-50"
      >
        <Command className="rounded-lg">
          <ScrollArea className="max-h-[300px] overflow-auto">
            {searchQuery && (
              <>
                <CorrectionSuggestions
                  corrections={corrections}
                  searchQuery={searchQuery}
                  onSelect={onSelect}
                />
                <RelatedSearches
                  relatedSearches={relatedSearches}
                  searchQuery={searchQuery}
                  onSelect={onSelect}
                />
              </>
            )}

            <SearchHistory
              history={history}
              onSelect={onSelect}
              onClearHistory={onClearHistory}
              onClearHistoryItem={onClearHistoryItem}
            />

            {isLoading && (
              <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
                Loading suggestions...
              </div>
            )}

            {!isLoading && searchQuery && suggestions.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No suggestions found
              </div>
            )}
          </ScrollArea>
        </Command>
      </motion.div>
    </AnimatePresence>
  );
}