import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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

export function CategoryListItem({ 
  category, 
  isAdmin, 
  onDelete 
}: CategoryListItemProps) {
  const navigate = useNavigate();
  const { isAdmin: isCurrentUserAdmin } = useAuth();

  const handleClick = () => {
    navigate(`/category/${category.id}`);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        className="w-full"
        onClick={handleClick}
      >
        <div className="flex flex-col items-start">
          <span className="font-bold text-tibetan-maroon">
            {category.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {category.description}
          </span>
        </div>
      </SidebarMenuButton>
      {isCurrentUserAdmin && (
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