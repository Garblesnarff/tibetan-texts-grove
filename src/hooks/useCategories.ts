import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types/category";
import { Categories } from "@/integrations/supabase/types/tables";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select<'categories', Categories['Row'] & { translation_count: { count: number }[] }>(`
          *,
          translation_count:translations(count)
        `)
        .order('title');

      if (error) throw error;

      if (data) {
        const transformedData: Category[] = data.map(category => ({
          id: category.id,
          title: category.title,
          description: category.description,
          created_at: category.created_at,
          updated_at: category.updated_at,
          created_by: category.created_by,
          translation_count: category.translation_count?.[0]?.count || 0
        }));

        setCategories(transformedData);
      }
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

  return {
    categories,
    isAdmin,
    fetchCategories,
    checkAdminStatus,
    handleDelete
  };
};