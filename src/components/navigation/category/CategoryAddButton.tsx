import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryAddButtonProps {
  onClick: () => void;
}

/**
 * CategoryAddButton Component
 * Renders a button to add a new category
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onClick - Callback when the button is clicked
 */
export function CategoryAddButton({ onClick }: CategoryAddButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full"
      onClick={onClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      Add Category
    </Button>
  );
}