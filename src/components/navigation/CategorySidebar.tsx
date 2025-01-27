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
import { ChevronRight } from "lucide-react";
import { Category } from "@/types/category";

export function CategorySidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          translation_count: translations(count)
        `)
        .order('title');

      if (error) throw error;

      // Transform the data to extract count from the array and ensure all required properties
      const transformedData = data.map(category => ({
        id: category.id,
        title: category.title,
        description: category.description,
        created_at: category.created_at,
        updated_at: category.updated_at,
        created_by: category.created_by,
        translation_count: category.translation_count?.[0]?.count || 0
      }));

      setCategories(transformedData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching categories",
        description: error.message
      });
    }
  };

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAdmin(user?.email === 'wonky.coin@gmail.com');
  };

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