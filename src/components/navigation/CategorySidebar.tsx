import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { CategoryManager } from "./CategoryManager";
import { CategoryList } from "./category/CategoryList";
import { ChevronRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

export function CategorySidebar() {
  const { 
    categories, 
    isAdmin, 
    fetchCategories, 
    checkAdminStatus, 
    handleDelete 
  } = useCategories();

  useEffect(() => {
    fetchCategories();
    checkAdminStatus();
  }, []);

  return (
    <Sidebar className="border-r border-tibetan-brown/20">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-tibetan text-lg text-tibetan-maroon flex items-center">
            <ChevronRight className="h-4 w-4 mr-2" />
            Translation Categories
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <CategoryList 
              categories={categories}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
            {isAdmin && <CategoryManager onCategoryChange={fetchCategories} />}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}