import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useCategories } from "@/hooks/useCategories";

interface ActiveFiltersProps {
  selectedTags: string[];
  selectedCategory: string | null;
  startDate: Date | null;
  endDate: Date | null;
  resultCount: number;
  onClearTag: (tag: string) => void;
  onClearCategory: () => void;
  onClearDates: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  selectedTags,
  selectedCategory,
  startDate,
  endDate,
  resultCount,
  onClearTag,
  onClearCategory,
  onClearDates,
  onClearAll,
}: ActiveFiltersProps) {
  const { categories } = useCategories();
  const hasActiveFilters = selectedTags.length > 0 || selectedCategory || (startDate && endDate);

  if (!hasActiveFilters) return null;

  const getCategoryTitle = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.title || "Unknown category";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-sm"
          >
            Clear all filters
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => onClearTag(tag)}
            />
          </Badge>
        ))}
        {selectedCategory && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {getCategoryTitle(selectedCategory)}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={onClearCategory}
            />
          </Badge>
        )}
        {startDate && endDate && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={onClearDates}
            />
          </Badge>
        )}
      </div>
    </div>
  );
}