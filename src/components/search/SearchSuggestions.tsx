import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Search, X, ArrowRight, Sparkles } from "lucide-react";
import { highlightText } from "@/utils/highlightText";

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 mt-2 rounded-lg border bg-background shadow-lg z-50"
      >
        <Command className="rounded-lg">
          <ScrollArea className="max-h-[300px] overflow-auto">
            {searchQuery && suggestions.length > 0 && (
              <div className="px-2 py-3">
                <p className="px-2 text-sm text-muted-foreground mb-2">Suggestions</p>
                {suggestions.map((suggestion) => (
                  <Command.Item
                    key={suggestion.id}
                    onSelect={() => onSelect(suggestion.suggested_term)}
                    className="flex items-center px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer"
                  >
                    {suggestion.type === 'correction' ? (
                      <Sparkles className="w-4 h-4 mr-2 text-muted-foreground" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-2 text-muted-foreground" />
                    )}
                    <span>{highlightText(suggestion.suggested_term, searchQuery)}</span>
                  </Command.Item>
                ))}
              </div>
            )}

            {history.length > 0 && (
              <div className="px-2 py-3 border-t">
                <div className="flex items-center justify-between px-2 mb-2">
                  <p className="text-sm text-muted-foreground">Recent searches</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearHistory}
                    className="h-auto p-1 hover:bg-accent"
                  >
                    Clear all
                  </Button>
                </div>
                {history.map(({ term, timestamp }) => (
                  <Command.Item
                    key={`${term}-${timestamp}`}
                    onSelect={() => onSelect(term)}
                    className="flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer"
                  >
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{term}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearHistoryItem(term);
                      }}
                      className="h-auto p-1 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </Command.Item>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
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