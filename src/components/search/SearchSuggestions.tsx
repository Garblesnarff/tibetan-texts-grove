import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CorrectionSuggestions } from "./suggestions/CorrectionSuggestions";
import { RelatedSearches } from "./suggestions/RelatedSearches";
import { SearchHistory } from "./suggestions/SearchHistory";
import { ErrorState } from "./suggestions/ErrorState";
import { OfflineState } from "./suggestions/OfflineState";
import { LoadingAndEmptyStates } from "./suggestions/LoadingAndEmptyStates";
import { SearchSuggestion } from "@/types/suggestions";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";

interface SearchSuggestionsProps {
  searchQuery: string;
  suggestions: SearchSuggestion[];
  history: Array<{ term: string; timestamp: number }>;
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  onSelect: (term: string) => void;
  onClearHistory: () => void;
  onClearHistoryItem: (term: string) => void;
  onRetry: () => void;
  visible: boolean;
}

export function SearchSuggestions({
  searchQuery,
  suggestions = [],
  history = [],
  isLoading,
  error,
  isOffline,
  onSelect,
  onClearHistory,
  onClearHistoryItem,
  onRetry,
  visible
}: SearchSuggestionsProps) {
  const { selectedIndex, setSelectedIndex, handleKeyDown } = useKeyboardNavigation(
    suggestions.length + history.length
  );

  if (!visible) return null;

  const safetyCheckedSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const corrections = safetyCheckedSuggestions.filter(s => s && s.type === 'correction');
  const relatedSearches = safetyCheckedSuggestions.filter(s => s && s.type === 'related');
  const safetyCheckedHistory = Array.isArray(history) ? history : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 rounded-lg border bg-background shadow-lg z-50"
        onKeyDown={handleKeyDown}
      >
        <Command className="rounded-lg">
          <ScrollArea className="max-h-[300px] overflow-auto">
            {error ? (
              <ErrorState error={error} onRetry={onRetry} />
            ) : isOffline ? (
              <OfflineState />
            ) : (
              <>
                {searchQuery && (
                  <>
                    <CorrectionSuggestions
                      corrections={corrections}
                      searchQuery={searchQuery}
                      onSelect={onSelect}
                      selectedIndex={selectedIndex}
                    />
                    <RelatedSearches
                      relatedSearches={relatedSearches}
                      searchQuery={searchQuery}
                      onSelect={onSelect}
                      selectedIndex={selectedIndex - corrections.length}
                    />
                  </>
                )}

                <SearchHistory
                  history={safetyCheckedHistory}
                  onSelect={onSelect}
                  onClearHistory={onClearHistory}
                  onClearHistoryItem={onClearHistoryItem}
                  selectedIndex={selectedIndex - corrections.length - relatedSearches.length}
                />

                <LoadingAndEmptyStates
                  isLoading={isLoading}
                  hasError={!!error}
                  hasQuery={!!searchQuery}
                  suggestionsCount={safetyCheckedSuggestions.length}
                />
              </>
            )}
          </ScrollArea>
        </Command>
      </motion.div>
    </AnimatePresence>
  );
}