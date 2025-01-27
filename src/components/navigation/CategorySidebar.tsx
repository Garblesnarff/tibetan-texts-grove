import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CategoryManager } from "./CategoryManager";
import { CategoryList } from "./category/CategoryList";
import { ChevronRight, PanelLeftClose } from "lucide-react";
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
      <SidebarHeader className="p-4 flex items-center justify-between">
        <span className="font-tibetan text-lg text-tibetan-maroon flex items-center">
          <ChevronRight className="h-4 w-4 mr-2" />
          Translation Categories
        </span>
        <SidebarTrigger>
          <PanelLeftClose className="h-4 w-4" />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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