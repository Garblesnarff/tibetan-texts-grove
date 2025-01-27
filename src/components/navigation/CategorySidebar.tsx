import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { CategoryManager } from "./CategoryManager";
import { CategoryList } from "./category/CategoryList";
import { ChevronRight, PanelLeftClose } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CategorySidebar() {
  const { 
    categories, 
    isAdmin, 
    fetchCategories, 
    checkAdminStatus, 
    handleDelete 
  } = useCategories();

  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    fetchCategories();
    checkAdminStatus();
  }, []);

  return (
    <>
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

      {/* Expand Button - Only visible when sidebar is collapsed */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed left-0 top-1/2 -translate-y-1/2 z-50",
          "transition-all duration-200 ease-in-out",
          "bg-background/80 backdrop-blur-sm hover:bg-accent",
          "border border-border rounded-r-md rounded-l-none",
          "opacity-0 translate-x-full",
          isCollapsed && "opacity-100 translate-x-0"
        )}
        onClick={toggleSidebar}
        aria-label="Expand sidebar"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
}