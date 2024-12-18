import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, FolderDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteTranslationDialog from "./DeleteTranslationDialog";

interface Category {
  id: string;
  title: string;
}

interface TranslationActionsProps {
  categories: Category[];
  onCategoryChange: (categoryId: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onEditingChange: (isEditing: boolean) => void;
}

/**
 * TranslationActions Component
 * Renders the action buttons (category dropdown, edit, delete) for a translation card
 * 
 * @param {Object} props - Component properties
 * @param {Category[]} props.categories - Available categories for the dropdown
 * @param {Function} props.onCategoryChange - Handler for category changes
 * @param {Function} props.onDelete - Handler for translation deletion
 * @param {Function} props.onEditingChange - Handler for toggling edit mode
 */
const TranslationActions = ({
  categories,
  onCategoryChange,
  onDelete,
  onEditingChange,
}: TranslationActionsProps) => {
  return (
    <div className="absolute top-2 right-2 z-50 flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 category-button bg-[#F2FCE2] hover:bg-[#F2FCE2]/80"
          >
            <FolderDown className="h-4 w-4 text-tibetan-brown" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 z-[100] bg-background border border-tibetan-brown/20 shadow-lg"
        >
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className="cursor-pointer hover:bg-tibetan-brown/10 focus:bg-tibetan-brown/20"
            >
              {category.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 edit-button bg-[#FEF7CD] hover:bg-[#FEF7CD]/80"
        onClick={() => onEditingChange(true)}
      >
        <Pencil className="h-4 w-4 text-tibetan-brown" />
      </Button>
      
      <DeleteTranslationDialog onDelete={onDelete} />
    </div>
  );
};

export default TranslationActions;