import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown, ArrowUp, Filter, Star, Clock, Eye, SortAsc, SortDesc, Folder } from "lucide-react";
import { SortOption, SortConfig } from "@/types/sorting";

const sortOptions: SortOption[] = [
  { label: "Best Match", value: "relevance:desc" },
  { label: "Newest First", value: "created_at:desc" },
  { label: "Oldest First", value: "created_at:asc" },
  { label: "Most Viewed", value: "view_count:desc" },
  { label: "Least Viewed", value: "view_count:asc" },
  { label: "Featured First", value: "featured:desc" },
  { label: "Title A-Z", value: "title:asc" },
  { label: "Title Z-A", value: "title:desc" },
  { label: "Category", value: "category_id:asc" },
];

interface SortingControlsProps {
  onSortChange: (config: SortConfig) => void;
  currentSort: string;
  isLoading?: boolean;
}

export const SortingControls = ({
  onSortChange,
  currentSort,
  isLoading = false,
}: SortingControlsProps) => {
  const handleSortSelect = (sortValue: string) => {
    const [field, direction] = sortValue.split(":");
    onSortChange({ field, direction: direction as 'asc' | 'desc' });
  };

  const getCurrentSortLabel = () => {
    return sortOptions.find(option => option.value === currentSort)?.label || "Sort by";
  };

  const getSortIcon = (value: string) => {
    switch (value.split(':')[0]) {
      case 'relevance': return Star;
      case 'created_at': return Clock;
      case 'view_count': return Eye;
      case 'title': return value.includes(':asc') ? SortAsc : SortDesc;
      case 'category_id': return Folder;
      default: return Filter;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-[180px] justify-start"
          disabled={isLoading}
        >
          {React.createElement(getSortIcon(currentSort), { 
            className: "mr-2 h-4 w-4" 
          })}
          {getCurrentSortLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {sortOptions.map((option) => {
          const Icon = getSortIcon(option.value);
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              className="cursor-pointer"
            >
              <Icon className="mr-2 h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};