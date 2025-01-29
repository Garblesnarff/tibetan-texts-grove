import { TagFilter } from "@/components/filtering/TagFilter";
import { SortingControls } from "@/components/sorting/SortingControls";
import { SortConfig } from "@/types/sorting";

interface SearchControlsProps {
  availableTags: { tag: string; count: number }[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  onSortChange: (config: SortConfig) => void;
  currentSort: string;
}

export function SearchControls({
  availableTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  onSortChange,
  currentSort,
}: SearchControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <TagFilter
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagSelect={onTagSelect}
        onTagRemove={onTagRemove}
      />
      <SortingControls
        onSortChange={onSortChange}
        currentSort={currentSort}
      />
    </div>
  );
}