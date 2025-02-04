import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation, parseTranslation } from "@/types/translation";

export const useCategoryTranslations = (categoryId: string | undefined) => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategoryTranslations = useCallback(async () => {
    if (!categoryId) {
      setError('No category ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data: translationsData, error: translationsError } = await supabase
        .from('translations')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })
        .abortSignal(new AbortController().signal);

      if (translationsError) throw translationsError;
      
      const parsedTranslations = translationsData.map(parseTranslation);
      setTranslations(parsedTranslations);
    } catch (error: any) {
      console.error('Error in fetchCategoryTranslations:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error fetching translations",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [categoryId, toast]);

  useEffect(() => {
    const abortController = new AbortController();
    fetchCategoryTranslations();
    
    return () => {
      abortController.abort();
    };
  }, [fetchCategoryTranslations]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation deleted successfully"
      });

      fetchCategoryTranslations();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting translation",
        description: error.message
      });
    }
  };

  return {
    translations,
    loading,
    error,
    fetchCategoryTranslations,
    handleDelete
  };
};