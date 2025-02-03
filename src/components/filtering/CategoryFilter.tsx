import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderOpen, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { categories, loading: isLoading } = useCategories();
  const { selectedIndex, handleKeyDown } = useKeyboardNavigation(categories.length);

  console.log("CategoryFilter: categories loaded", categories.length);

  const getSelectedCategoryTitle = () => {
    if (!selectedCategory) return "All categories";
    const category = categories.find(c => c.id === selectedCategory);
    return category?.title || "All categories";
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-[180px]" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "flex gap-2 items-center bg-white dark:bg-gray-950",
            "hover:bg-tibetan-gold/5 dark:hover:bg-tibetan-gold/10",
            "focus:ring-2 focus:ring-tibetan-gold/20",
            "transition-all duration-200"
          )}
          aria-label="Select category filter"
        >
          <FolderOpen className="h-4 w-4 text-tibetan-maroon" />
          <span className="text-tibetan-brown">{getSelectedCategoryTitle()}</span>
          {selectedCategory && (
            <X 
              className="h-4 w-4 ml-2 hover:text-destructive transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                onCategoryChange(null);
              }}
              aria-label="Clear category selection"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className={cn(
          "z-50 min-w-[220px] bg-white dark:bg-gray-950",
          "border border-tibetan-brown/20",
          "shadow-lg shadow-tibetan-gold/5"
        )}
        onKeyDown={handleKeyDown}
      >
        <DropdownMenuItem 
          onClick={() => onCategoryChange(null)}
          className={cn(
            "flex justify-between items-center",
            "hover:bg-tibetan-gold/5 dark:hover:bg-tibetan-gold/10",
            "focus:bg-tibetan-gold/10 dark:focus:bg-tibetan-gold/20",
            "transition-colors duration-200",
            selectedIndex === -1 && "bg-tibetan-gold/5"
          )}
          data-index={-1}
        >
          <span>All categories</span>
          <span className="text-sm text-muted-foreground">
            {categories.reduce((sum, cat) => sum + (cat.translation_count || 0), 0)}
          </span>
        </DropdownMenuItem>
        {categories.map((category, index) => (
          <DropdownMenuItem
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex justify-between items-center",
              "hover:bg-tibetan-gold/5 dark:hover:bg-tibetan-gold/10",
              "focus:bg-tibetan-gold/10 dark:focus:bg-tibetan-gold/20",
              "transition-colors duration-200",
              selectedIndex === index && "bg-tibetan-gold/5"
            )}
            data-index={index}
          >
            <span>{category.title}</span>
            <span className="text-sm text-muted-foreground">
              {category.translation_count || 0}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}