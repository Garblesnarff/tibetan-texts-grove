import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";

/**
 * Custom hook for managing translations within a category
 * @param categoryId - UUID of the category to fetch translations for
 * @returns Object containing translations data and loading state
 */
export const useCategoryTranslations = (categoryId: string | undefined) => {
  const [translations, setTranslations] = useState<GroupedTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Groups translations by their code (first word of title)
   * @param translationsData - Array of translations to group
   * @returns Array of grouped translations
   */
  const groupTranslations = (translationsData: Translation[]): GroupedTranslation[] => {
    return translationsData.reduce((acc: GroupedTranslation[], translation: Translation) => {
      const code = translation.title.split(' ')[0];
      const existingGroup = acc.find(group => group.code === code);
      
      if (existingGroup) {
        existingGroup.translations.push(translation);
      } else {
        acc.push({
          code,
          translations: [translation]
        });
      }
      
      return acc;
    }, []);
  };

  /**
   * Fetches translations for the specified category
   */
  const fetchCategoryTranslations = async () => {
    try {
      if (!categoryId) {
        console.log('No category ID provided');
        setLoading(false);
        return;
      }

      console.log('Fetching translations for category:', categoryId);
      
      const { data: translationsData, error: translationsError } = await supabase
        .from('translations')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (translationsError) throw translationsError;

      console.log('Fetched translations:', translationsData);
      
      const groupedData = groupTranslations(translationsData);
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
  };

  /**
   * Handles deletion of a translation
   * @param id - UUID of the translation to delete
   */
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
    fetchCategoryTranslations,
    handleDelete
  };
};