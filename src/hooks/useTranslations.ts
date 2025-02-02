import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";
import { groupTranslations } from "@/utils/translationUtils";

/**
 * Custom hook for managing translations data and operations
 * Only returns uncategorized translations for the main page
 * @returns {Object} Object containing translations data and management functions
 */
export const useTranslations = () => {
  const [translations, setTranslations] = useState<GroupedTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Fetches uncategorized translations from the database and groups them
   * @returns {Promise<void>}
   */
  const fetchTranslations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .is('category_id', null)  // Only fetch translations without a category
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const groupedData = groupTranslations(data as Translation[]);
      setTranslations(groupedData);
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

  /**
   * Handles the deletion of a translation
   * @param {string} id - ID of the translation to be deleted
   * @returns {Promise<void>}
   */
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

      // Refresh translations after successful deletion
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