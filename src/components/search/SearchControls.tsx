import { TagFilter } from "@/components/filtering/TagFilter";
import { CategoryFilter } from "@/components/filtering/CategoryFilter";
import { DateRangeFilter } from "@/components/filtering/DateRangeFilter";
import { SortingControls } from "@/components/sorting/SortingControls";
import { SortConfig } from "@/types/sorting";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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
  isLoadingTags?: boolean;
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
  isLoadingTags = false,
}: SearchControlsProps) {
  return (
    <motion.div 
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
      {isLoadingTags ? (
        <div className="space-y-2">
          <Skeleton className="h-9 w-[180px]" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ) : (
        <TagFilter
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagSelect={onTagSelect}
          onTagRemove={onTagRemove}
        />
      )}
    </motion.div>
  );
}