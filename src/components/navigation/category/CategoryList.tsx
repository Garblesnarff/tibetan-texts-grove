import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarMenu } from "@/components/ui/sidebar";
import { CategoryListItem } from "../CategoryListItem";
import { Category } from "@/types/category";

interface CategoryListProps {
  categories: Category[];
  isAdmin: boolean;
  onDelete: (category: Category) => Promise<void>;
}

export const CategoryList = ({ 
  categories, 
  isAdmin, 
  onDelete 
}: CategoryListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <SidebarMenu>
        {categories.map((category) => (
          <CategoryListItem
            key={category.id}
            category={category}
            isAdmin={isAdmin}
            onDelete={onDelete}
          />
        ))}
      </SidebarMenu>
    </ScrollArea>
  );
};