import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";
import { groupTranslations } from "@/utils/translationUtils";
import { TranslationQueryOptions, SectionQueryOptions } from "@/types/queryOptions";

export const useTranslations = () => {
  const [translations, setTranslations] = useState<GroupedTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchTranslations = useCallback(async (options: TranslationQueryOptions = {}) => {
    try {
      console.log('Fetching translations with options:', options);
      setLoading(true);
      setError(null);

      let query = supabase
        .from('translations')
        .select('*');

      // Apply filters based on options
      if (options.featured !== undefined) {
        console.log('Filtering by featured:', options.featured);
        query = query.eq('featured', options.featured);
      }

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      if (options.searchQuery) {
        query = query.textSearch('search_vector', options.searchQuery);
      }

      // Apply sorting
      if (options.sortBy) {
        const [field, direction] = options.sortBy.split(':');
        console.log('Sorting by:', field, direction);
        query = query.order(field, { ascending: direction === 'asc' });
      }

      // Apply limit
      if (options.limit) {
        console.log('Limiting results to:', options.limit);
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      console.log('Fetched translations:', data);
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

  return {
    translations,
    loading,
    error,
    fetchTranslations
  };
};