import { Command } from "cmdk";
import { ArrowRight, FolderOpen, Hash } from "lucide-react";
import { motion } from "framer-motion";
import { SearchSuggestion } from "@/types/suggestions";
import { Badge } from "@/components/ui/badge";

interface RelatedSearchesProps {
  relatedSearches: SearchSuggestion[];
  searchQuery: string;
  onSelect: (term: string) => void;
  selectedIndex: number;
}

export function RelatedSearches({
  relatedSearches,
  searchQuery,
  onSelect,
  selectedIndex,
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
            className={`flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm group ${
              selectedIndex === index ? "bg-accent" : ""
            }`}
          >
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">{related.suggested_term}</span>
            <div className="flex items-center gap-1">
              {related.category_title && (
                <Badge variant="outline" className="text-xs">
                  <FolderOpen className="h-3 w-3 mr-1" />
                  {related.category_title}
                </Badge>
              )}
              {related.tag_similarity && related.tag_similarity > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <Hash className="h-3 w-3 mr-1" />
                  {Math.round(related.tag_similarity * 100)}% match
                </Badge>
              )}
            </div>
          </Command.Item>
        </motion.div>
      ))}
    </div>
  );
}