import { TagFilter } from "@/components/filtering/TagFilter";
import { CategoryFilter } from "@/components/filtering/CategoryFilter";
import { DateRangeFilter } from "@/components/filtering/DateRangeFilter";
import { SortingControls } from "@/components/sorting/SortingControls";
import { SortConfig } from "@/types/sorting";

interface SearchControlsProps {
  availableTags: { tag: string; count: number }[];
  selectedTags: string[];
  selectedCategory: string | null;
  startDate: Date | null;
  endDate: Date | null;
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  onCategoryChange: (category: string | null) => void;
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  onSortChange: (config: SortConfig) => void;
  currentSort: string;
}

export function SearchControls({
  availableTags,
  selectedTags,
  selectedCategory,
  startDate,
  endDate,
  onTagSelect,
  onTagRemove,
  onCategoryChange,
  onDateChange,
  onSortChange,
  currentSort,
}: SearchControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onDateChange={onDateChange}
        />
        <SortingControls
          onSortChange={onSortChange}
          currentSort={currentSort}
        />
      </div>
      <TagFilter
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagSelect={onTagSelect}
        onTagRemove={onTagRemove}
      />
    </div>
  );
}