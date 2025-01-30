import { Command } from "cmdk";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SearchSuggestion } from "@/hooks/useSearchSuggestions";

interface CorrectionSuggestionsProps {
  corrections: SearchSuggestion[];
  searchQuery: string;
  onSelect: (term: string) => void;
}

export function CorrectionSuggestions({
  corrections,
  searchQuery,
  onSelect,
}: CorrectionSuggestionsProps) {
  if (corrections.length === 0) return null;

  return (
    <div className="px-1 py-2">
      <p className="px-2 text-xs text-muted-foreground mb-2">
        Did you mean:
      </p>
      {corrections.map((correction) => (
        <motion.div
          key={correction.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Command.Item
            value={correction.suggested_term}
            onSelect={() => onSelect(correction.suggested_term)}
            className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
          >
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">{correction.suggested_term}</span>
            <span className="text-xs text-muted-foreground">
              instead of "{searchQuery}"
            </span>
          </Command.Item>
        </motion.div>
      ))}
    </div>
  );
}