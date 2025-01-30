import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Search, X, ArrowRight, Sparkles } from "lucide-react";
import { highlightText } from "@/utils/highlightText";
import { formatDistanceToNow } from 'date-fns';

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
            {searchQuery && corrections.length > 0 && (
              <div className="px-2 py-3 border-b">
                <p className="px-2 text-sm text-muted-foreground mb-2">Did you mean?</p>
                {corrections.map((suggestion) => (
                  <Command.Item
                    key={suggestion.id}
                    onSelect={() => onSelect(suggestion.suggested_term)}
                    className="flex items-center px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer group"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span>{highlightText(suggestion.suggested_term, searchQuery)}</span>
                  </Command.Item>
                ))}
              </div>
            )}

            {searchQuery && relatedSearches.length > 0 && (
              <div className="px-2 py-3 border-b">
                <p className="px-2 text-sm text-muted-foreground mb-2">Related searches</p>
                {relatedSearches.map((suggestion) => (
                  <Command.Item
                    key={suggestion.id}
                    onSelect={() => onSelect(suggestion.suggested_term)}
                    className="flex items-center px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span>{highlightText(suggestion.suggested_term, searchQuery)}</span>
                  </Command.Item>
                ))}
              </div>
            )}

            {history.length > 0 && (
              <div className="px-2 py-3">
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
                    className="flex items-center justify-between px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer group"
                  >
                    <div className="flex items-center flex-1">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="flex flex-col">
                        <span>{term}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClearHistoryItem(term);
                      }}
                      className="h-auto p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </Command.Item>
                ))}
              </div>
            )}

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