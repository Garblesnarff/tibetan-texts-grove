import { Command } from "cmdk";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SearchSuggestion } from "@/hooks/useSearchSuggestions";

interface RelatedSearchesProps {
  relatedSearches: SearchSuggestion[];
  searchQuery: string;
  onSelect: (term: string) => void;
}

export function RelatedSearches({
  relatedSearches,
  searchQuery,
  onSelect,
}: RelatedSearchesProps) {
  if (relatedSearches.length === 0) return null;

  return (
    <div className="px-1 py-2">
      <p className="px-2 text-xs text-muted-foreground mb-2">
        Related searches:
      </p>
      {relatedSearches.map((related, index) => (
        <motion.div
          key={related.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Command.Item
            value={related.suggested_term}
            onSelect={() => onSelect(related.suggested_term)}
            className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
          >
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">{related.suggested_term}</span>
          </Command.Item>
        </motion.div>
      ))}
    </div>
  );
}