import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Folder, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryListItemProps {
  category: Category;
  isAdmin: boolean;
  onDelete: (category: Category) => Promise<void>;
}

export const CategoryListItem = ({ 
  category,
  isAdmin,
  onDelete
}: CategoryListItemProps) => {
  return (
    <SidebarMenuItem className="group relative">
      <SidebarMenuButton asChild>
        <Link 
          to={`/category/${category.id}`} 
          className="flex justify-between items-center transition-all duration-200 hover:scale-[1.02]"
        >
          <span className="flex items-center">
            <Folder className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">{category.title}</span>
          </span>
          <span className="text-muted-foreground text-sm ml-2 shrink-0">
            {category.translation_count}
          </span>
        </Link>
      </SidebarMenuButton>
      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(category);
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete category</span>
        </Button>
      )}
    </SidebarMenuItem>
  );
};