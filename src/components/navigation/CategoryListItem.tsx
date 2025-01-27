import { Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  title: string;
  description: string;
  translation_count?: number;
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
  const { categoryId } = useParams();
  const { isAdmin: isCurrentUserAdmin } = useAuth();
  const isActive = category.id === categoryId;

  const handleClick = () => {
    navigate(`/category/${category.id}`);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        className={`w-full transition-all duration-200 ${
          isActive ? 'bg-tibetan-brown/10' : 'hover:bg-tibetan-brown/5'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start">
            <span className="font-bold text-tibetan-maroon font-tibetan">
              {category.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {category.description}
            </span>
          </div>
          <Badge variant="secondary" className="ml-2">
            {category.translation_count || 0}
          </Badge>
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