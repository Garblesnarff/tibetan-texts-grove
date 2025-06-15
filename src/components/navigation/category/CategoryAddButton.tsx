
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryAddButtonProps {
  /** Callback when the add category button is clicked */
  onClick: () => void;
}

/**
 * CategoryAddButton Component
 * Renders a button to add a new category, styled consistently with sidebar actions.
 * 
 * @component
 * @param {CategoryAddButtonProps} props
 */
export function CategoryAddButton({ onClick }: CategoryAddButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full transition-colors duration-300 hover:bg-tibetan-gold/5 hover:text-tibetan-maroon"
      onClick={onClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      Add Category
    </Button>
  );
}
