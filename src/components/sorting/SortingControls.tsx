import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, ArrowUp, Filter } from "lucide-react";
import { SortOption, SortConfig } from "@/types/sorting";

const sortOptions: SortOption[] = [
  { label: "Newest First", value: "created_at:desc" },
  { label: "Oldest First", value: "created_at:asc" },
  { label: "Most Viewed", value: "view_count:desc" },
  { label: "Least Viewed", value: "view_count:asc" },
  { label: "Featured First", value: "featured:desc" },
];

interface SortingControlsProps {
  onSortChange: (config: SortConfig) => void;
  currentSort: string;
}

export const SortingControls = ({
  onSortChange,
  currentSort,
}: SortingControlsProps) => {
  const handleSortSelect = (sortValue: string) => {
    const [field, direction] = sortValue.split(":");
    onSortChange({ field, direction: direction as 'asc' | 'desc' });
  };

  const getCurrentSortLabel = () => {
    return sortOptions.find(option => option.value === currentSort)?.label || "Sort by";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-start">
          <Filter className="mr-2 h-4 w-4" />
          {getCurrentSortLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortSelect(option.value)}
            className="cursor-pointer"
          >
            {option.value.includes(":desc") ? (
              <ArrowDown className="mr-2 h-4 w-4" />
            ) : (
              <ArrowUp className="mr-2 h-4 w-4" />
            )}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};