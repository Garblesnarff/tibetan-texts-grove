import { useRef, useState } from "react";
import { Category } from "@/types/category";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";

interface HorizontalCategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  isLoading?: boolean;
}

export function HorizontalCategoryList({
  categories,
  selectedCategory,
  onCategorySelect,
  isLoading = false,
}: HorizontalCategoryListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const { selectedIndex, handleKeyDown } = useKeyboardNavigation(categories.length);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = direction === 'left' ? -200 : 200;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="w-full py-4 px-2">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-32 bg-muted animate-pulse rounded-md"
            />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="w-full py-4 px-2 text-center text-muted-foreground">
        No categories available
      </div>
    );
  }

  return (
    <div className="relative w-full py-4 group">
      {showLeftScroll && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-accent shadow-md"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <ScrollArea 
        className="w-full" 
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        <div 
          className="flex space-x-2 px-4"
          role="listbox"
          aria-label="Category list"
          onKeyDown={handleKeyDown}
        >
          {categories.map((category, index) => (
            <Button
              key={category.id}
              variant="ghost"
              className={cn(
                "group relative min-w-[120px] h-10",
                "transition-all duration-200",
                "hover:bg-tibetan-brown/10",
                "focus-visible:ring-2 focus-visible:ring-tibetan-maroon",
                selectedCategory === category.id && "bg-tibetan-brown/20",
                selectedIndex === index && "ring-2 ring-tibetan-maroon"
              )}
              onClick={() => onCategorySelect(category.id)}
              role="option"
              aria-selected={selectedCategory === category.id}
              data-index={index}
            >
              <span className="truncate">{category.title}</span>
              <Badge 
                variant="secondary"
                className={cn(
                  "ml-2 bg-tibetan-gold/10 hover:bg-tibetan-gold/20",
                  "transition-colors duration-200"
                )}
              >
                {category.translation_count}
              </Badge>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>

      {showRightScroll && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-accent shadow-md"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}