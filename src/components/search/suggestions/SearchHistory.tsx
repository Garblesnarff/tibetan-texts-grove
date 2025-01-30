import { Command } from "cmdk";
import { Clock, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface SearchHistoryProps {
  history: Array<{ term: string; timestamp: number }>;
  onSelect: (term: string) => void;
  onClearHistory: () => void;
  onClearHistoryItem: (term: string) => void;
  selectedIndex: number;
}

export function SearchHistory({
  history,
  onSelect,
  onClearHistory,
  onClearHistoryItem,
  selectedIndex,
}: SearchHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="px-1 py-2">
      <div className="flex items-center justify-between px-2 mb-2">
        <p className="text-xs text-muted-foreground">Recent searches</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          className="h-auto px-2 py-1 text-xs hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear all
        </Button>
      </div>
      <div className="space-y-1">
        {history.map((item, index) => (
          <motion.div
            key={`${item.term}-${item.timestamp}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Command.Item
              value={item.term}
              onSelect={() => onSelect(item.term)}
              className={`flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm group ${
                selectedIndex === index ? "bg-accent" : ""
              }`}
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1">{item.term}</span>
              <span className="text-xs text-muted-foreground">
                {format(item.timestamp, "MMM d, h:mm a")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearHistoryItem(item.term);
                }}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </Command.Item>
          </motion.div>
        ))}
      </div>
    </div>
  );
}