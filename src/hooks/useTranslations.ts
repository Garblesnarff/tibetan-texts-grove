import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";
import { groupTranslations } from "@/utils/translationUtils";

interface TranslationsOptions {
  filters?: {
    featured?: boolean;
    categoryId?: string;
  };
  limit?: number;
  orderBy?: {
    column: 'created_at' | 'view_count' | 'updated_at';
    order: 'asc' | 'desc';
  };
}

export const useTranslations = (options: TranslationsOptions = {}) => {
  const [translations, setTranslations] = useState<GroupedTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchTranslations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('translations')
        .select('*');

      // Apply filters if provided
      if (options.filters?.featured !== undefined) {
        query = query.eq('featured', options.filters.featured);
      }
      
      if (options.filters?.categoryId) {
        query = query.eq('category_id', options.filters.categoryId);
      }

      // Apply sorting if provided
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.order === 'asc' 
        });
      }

      // Apply limit if provided
      if (options.limit) {
        query = query.limit(options.limit);
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
  }, [options, toast]);

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

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