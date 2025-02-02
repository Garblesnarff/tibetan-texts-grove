import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";
import { groupTranslations } from "@/utils/translationUtils";

interface FetchOptions {
  featured?: boolean;
  sortBy?: string;
  limit?: number;
  categoryId?: string;
}

export const useTranslations = () => {
  const [translations, setTranslations] = useState<GroupedTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchTranslations = useCallback(async (options: FetchOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('translations')
        .select('*')
        .is('category_id', null);

      if (options.featured !== undefined) {
        query = query.eq('featured', options.featured);
      }

      if (options.sortBy) {
        const [field, direction] = options.sortBy.split(':');
        query = query.order(field, { ascending: direction === 'asc' });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const groupedData = groupTranslations(data as Translation[]);
      setTranslations(groupedData);
    } catch (error: any) {
      console.error('Error fetching translations:', error);
      setError(error);
      toast({
        variant: "destructive",
        title: "Error fetching translations",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Translation not found');
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Translation deleted successfully",
      });

      fetchTranslations();
    } catch (error: any) {
      console.error('Error deleting translation:', error);
      toast({
        variant: "destructive",
        title: "Error deleting translation",
        description: error.message || "An error occurred while deleting the translation"
      });
    }
  };

  return {
    translations,
    loading,
    error,
    fetchTranslations,
    handleDelete
  };
};