import { Command } from "cmdk";
import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';

interface SearchHistoryProps {
  history: Array<{ term: string; timestamp: number }>;
  onSelect: (term: string) => void;
  onClearHistory: () => void;
  onClearHistoryItem: (term: string) => void;
}

export const SearchHistory = ({
  history,
  onSelect,
  onClearHistory,
  onClearHistoryItem,
}: SearchHistoryProps) => {
  if (history.length === 0) return null;

  return (
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
  );
};