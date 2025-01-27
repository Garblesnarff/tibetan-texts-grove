import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FolderDown } from "lucide-react";

interface CategorySelectProps {
  categories: Array<{ id: string; title: string }>;
  onCategoryChange: (categoryId: string) => Promise<void>;
}

const CategorySelect = ({ categories, onCategoryChange }: CategorySelectProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 category-button bg-[#0EA5E9] hover:bg-[#0EA5E9]/80"
        >
          <FolderDown className="h-4 w-4 text-white" />
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
  );
};

export default CategorySelect;