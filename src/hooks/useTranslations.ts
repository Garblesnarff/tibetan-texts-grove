import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";

export const useTranslations = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTranslations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .is('category_id', null)  // Only fetch translations without a category
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTranslations(data as Translation[]);
    } catch (error: any) {
      console.error('Error fetching translations:', error);
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
    fetchTranslations,
    handleDelete
  };
};