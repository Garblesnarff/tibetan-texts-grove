import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryManager } from "./CategoryManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Category {
  id: string;
  title: string;
  description: string;
}

export function CategorySidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    checkAdminStatus();
  }, []);

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
      
      // Refresh categories after deletion
      fetchCategories();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting category",
        description: error.message
      });
    }
  };

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
                  <SidebarMenuItem key={category.id}>
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
                        onClick={() => handleDelete(category)}
                        className="hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </SidebarMenuAction>
                    )}
                  </SidebarMenuItem>
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