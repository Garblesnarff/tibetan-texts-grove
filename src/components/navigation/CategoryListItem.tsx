import { Trash2 } from "lucide-react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";

interface Category {
  id: string;
  title: string;
  description: string;
}

interface CategoryListItemProps {
  category: Category;
  isAdmin: boolean;
  onDelete: (category: Category) => void;
}

/**
 * CategoryListItem Component
 * Renders a single category item in the sidebar
 * @param category - The category to display
 * @param isAdmin - Whether the current user is an admin
 * @param onDelete - Callback function when delete button is clicked
 */
export function CategoryListItem({ 
  category, 
  isAdmin, 
  onDelete 
}: CategoryListItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton className="w-full">
        <div className="flex flex-col items-start">
          <span className="font-bold text-tibetan-maroon">
            {category.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {category.description}
          </span>
        </div>
      </SidebarMenuButton>
      {isAdmin && (
        <SidebarMenuAction
          onClick={() => onDelete(category)}
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </SidebarMenuAction>
      )}
    </SidebarMenuItem>
  );
}