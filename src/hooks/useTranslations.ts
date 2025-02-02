import { useState, useCallback, useEffect, useRef } from "react";
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
  const retryCount = useRef(0);
  const mounted = useRef(true);

  const fetchWithRetry = async (attempt: number = 0) => {
    try {
      console.log(`Attempting to fetch translations (attempt ${attempt + 1}/3)`);
      console.log('Fetch options:', options);

      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      let query = supabase
        .from('translations')
        .select('*');

      if (options.category_id) {
        console.log('Filtering by category:', options.category_id);
        query = query.eq('category_id', options.category_id);
      } else {
        console.log('No category filter applied');
        query = query.is('category_id', null);
      }

      if (options.featured) {
        query = query.eq('featured', true);
      }

      if (options.orderBy) {
        query = query.order(options.orderBy, { ascending: false });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      console.log('Executing Supabase query...');
      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching translations:', fetchError);
        throw fetchError;
      }

      console.log('Raw response from Supabase:', data);

      if (!mounted.current) return;
      
      if (data) {
        console.log('Processing fetched translations...');
        const groupedData = groupTranslations(data as Translation[]);
        console.log('Grouped translations:', groupedData);
        setTranslations(groupedData);
        setError(null);
        retryCount.current = 0;
      } else {
        console.log('No translations found');
        setTranslations([]);
      }

    } catch (err: any) {
      console.error(`Fetch attempt ${attempt + 1} failed:`, err);

      if (!mounted.current) return;

      if (attempt < 2) {
        console.log(`Retrying in 1000ms...`);
        setTimeout(() => {
          retryCount.current = attempt + 1;
          fetchWithRetry(attempt + 1);
        }, 1000);
      } else {
        setError(err);
        toast({
          variant: "destructive",
          title: "Error fetching translations",
          description: err.message
        });
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const fetchTranslations = useCallback(async () => {
    console.log('useTranslations effect triggered with options:', options);
    setLoading(true);
    setError(null);
    await fetchWithRetry();
  }, [toast, options]);

  useEffect(() => {
    mounted.current = true;
    fetchTranslations();

    return () => {
      mounted.current = false;
    };
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