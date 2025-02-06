import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryAddButtonProps {
  onClick: () => void;
}

export function CategoryAddButton({ onClick }: CategoryAddButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full transition-colors duration-200 hover:bg-tibetan-gold/5 hover:text-tibetan-maroon"
      onClick={onClick}
    >
      <Plus className="mr-2 h-4 w-4" />
      Add Category
    </Button>
  );
}