import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Category } from "@/types/category";

interface CategoryListItemProps {
  category: Category;
  isAdmin: boolean;
  onDelete: (category: Category) => Promise<void>;
}

export function CategoryListItem({ 
  category, 
  isAdmin, 
  onDelete 
}: CategoryListItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link 
          to={`/categories/${category.id}`}
          className="flex items-center justify-between w-full"
        >
          <span>{category.title}</span>
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-2 hover:bg-destructive/10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(category);
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Delete category</span>
            </Button>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}