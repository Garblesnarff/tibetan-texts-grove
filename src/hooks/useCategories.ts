import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('categories')
        .select(`
          *,
          translation_count: translations(count)
        `)
        .order('title');

      if (supabaseError) throw supabaseError;

      const transformedData = data.map(category => ({
        id: category.id,
        title: category.title,
        tibetan_title: category.tibetan_title,
        description: category.description,
        created_at: category.created_at,
        updated_at: category.updated_at,
        created_by: category.created_by,
        translation_count: category.translation_count?.[0]?.count || 0
      }));

      setCategories(transformedData);
    } catch (err: any) {
      setError(err);
      toast({
        variant: "destructive",
        title: "Error fetching categories",
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAdmin(user?.email === 'wonky.coin@gmail.com');
  };

  const handleDelete = async (category: Category) => {
    try {
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
      
      fetchCategories();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error deleting category",
        description: err.message
      });
    }
  };

  return {
    categories,
    isAdmin,
    loading,
    error,
    fetchCategories,
    checkAdminStatus,
    handleDelete
  };
};