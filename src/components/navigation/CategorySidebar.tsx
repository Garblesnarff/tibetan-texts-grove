import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryManager } from "./CategoryManager";
import { CategoryListItem } from "./CategoryListItem";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  title: string;
  description: string;
}

/**
 * CategorySidebar Component
 * Displays a sidebar with a list of translation categories
 * Includes category management functionality for admin users
 */
export function CategorySidebar() {
  // State management
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  /**
   * Fetch categories from the database
   * Updates the categories state and handles any errors
   */
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('title');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching categories",
        description: error.message
      });
    }
  };

  /**
   * Check if the current user is an admin
   * Currently checks against a specific email address
   */
  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAdmin(user?.email === 'wonky.coin@gmail.com');
  };

  /**
   * Handle category deletion
   * Deletes the category and refreshes the list
   */
  const handleDelete = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
      
      fetchCategories();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting category",
        description: error.message
      });
    }
  };

  // Initialize component
  useEffect(() => {
    fetchCategories();
    checkAdminStatus();
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-tibetan text-lg text-tibetan-maroon">
            Translation Categories
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <SidebarMenu>
                {categories.map((category) => (
                  <CategoryListItem
                    key={category.id}
                    category={category}
                    isAdmin={isAdmin}
                    onDelete={handleDelete}
                  />
                ))}
              </SidebarMenu>
              {isAdmin && <CategoryManager onCategoryChange={fetchCategories} />}
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}