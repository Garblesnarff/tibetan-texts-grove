import { Command } from "cmdk";
import { Sparkles } from "lucide-react";
import { highlightText } from "@/utils/highlightText";

interface CorrectionSuggestionsProps {
  corrections: Array<{
    id: string;
    suggested_term: string;
  }>;
  searchQuery: string;
  onSelect: (term: string) => void;
}

export const CorrectionSuggestions = ({
  corrections,
  searchQuery,
  onSelect,
}: CorrectionSuggestionsProps) => {
  if (corrections.length === 0) return null;

  return (
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
  );
};