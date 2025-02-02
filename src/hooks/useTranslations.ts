import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";
import { groupTranslations } from "@/utils/translationUtils";

export interface TranslationQueryOptions {
  featured?: boolean;
  orderBy?: 'created_at' | 'view_count';
  limit?: number;
  category_id?: string;
}

export const useTranslations = (options: TranslationQueryOptions = {}) => {
  const [translations, setTranslations] = useState<GroupedTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchTranslations = useCallback(async () => {
    try {
      console.log('Fetching translations with options:', options);
      setLoading(true);
      setError(null);

      let query = supabase
        .from('translations')
        .select('*');

      // Apply category filter if specified
      if (options.category_id) {
        console.log('Filtering by category:', options.category_id);
        query = query.eq('category_id', options.category_id);
      } else {
        console.log('No category filter applied');
        query = query.is('category_id', null);
      }

      // Apply featured filter
      if (options.featured) {
        query = query.eq('featured', true);
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: false });
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching translations:', fetchError);
        throw fetchError;
      }
      
      console.log('Fetched translations:', data);
      const groupedData = groupTranslations(data as Translation[]);
      setTranslations(groupedData);
      setError(null);
    } catch (err: any) {
      console.error('Error in fetchTranslations:', err);
      setError(err);
      toast({
        variant: "destructive",
        title: "Error fetching translations",
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  }, [options, toast]);

  // Fetch translations on mount and when options change
  useEffect(() => {
    console.log('useTranslations effect triggered with options:', options);
    fetchTranslations();
  }, [fetchTranslations]);

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: "Translation deleted successfully",
      });

      fetchTranslations();
    } catch (err: any) {
      console.error('Error deleting translation:', err);
      toast({
        variant: "destructive",
        title: "Error deleting translation",
        description: err.message
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