import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderOpen, X } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { categories } = useCategories();

  const getSelectedCategoryTitle = () => {
    if (!selectedCategory) return "All categories";
    const category = categories.find(c => c.id === selectedCategory);
    return category?.title || "All categories";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <FolderOpen className="h-4 w-4" />
          <span>{getSelectedCategoryTitle()}</span>
          {selectedCategory && (
            <X 
              className="h-4 w-4 ml-2 hover:text-destructive" 
              onClick={(e) => {
                e.stopPropagation();
                onCategoryChange(null);
              }}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onCategoryChange(null)}>
          All categories
        </DropdownMenuItem>
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}