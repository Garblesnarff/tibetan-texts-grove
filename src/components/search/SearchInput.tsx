import { useState, useRef, KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchSuggestions } from "./SearchSuggestions";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { useOnClickOutside } from "@/hooks/use-click-outside";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  selectedCategory?: string | null;
}

export function SearchInput({ value, onChange, onClear, onKeyDown, selectedCategory }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    suggestions,
    history,
    isLoading,
    error,
    isOffline,
    addToHistory,
    clearHistory,
    clearHistoryItem,
    retryFetch
  } = useSearchSuggestions(value, selectedCategory);

  useOnClickOutside(containerRef, () => setIsFocused(false));

  const handleSelect = (term: string) => {
    onChange(term);
    addToHistory(term);
    setIsFocused(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={onKeyDown}
          className="pl-10 pr-10"
          placeholder="Search translations..."
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-transparent"
            onClick={() => {
              onClear();
              setIsFocused(false);
            }}
          >
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      <SearchSuggestions
        searchQuery={value}
        suggestions={suggestions}
        history={history}
        isLoading={isLoading}
        error={error}
        isOffline={isOffline}
        onSelect={handleSelect}
        onClearHistory={clearHistory}
        onClearHistoryItem={clearHistoryItem}
        onRetry={retryFetch}
        visible={isFocused}
      />
    </div>
  );
}