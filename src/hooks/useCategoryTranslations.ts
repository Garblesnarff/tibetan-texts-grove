import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";

export const useCategoryTranslations = (categoryId: string | undefined) => {
  const [translations, setTranslations] = useState<GroupedTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
        .order('created_at', { ascending: false })
        .throwOnError();

      if (translationsError) {
        console.error('Supabase error details:', {
          message: translationsError.message,
          details: translationsError.details,
          hint: translationsError.hint,
          status: translationsError.status
        });
        throw translationsError;
      }

      if (!translationsData) {
        console.log('No translations found for category:', categoryId);
        setTranslations([]);
        return;
      }

      console.log('Successfully fetched translations:', translationsData);
      
      const groupedData = groupTranslations(translationsData);
      setTranslations(groupedData);
    } catch (error: any) {
      console.error('Error fetching translations:', {
        error,
        categoryId,
        message: error.message,
        details: error.details,
        status: error?.status
      });
      toast({
        variant: "destructive",
        title: "Error fetching translations",
        description: error.message || "Failed to fetch translations"
      });
      setTranslations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id)
        .throwOnError();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation deleted successfully"
      });

      fetchCategoryTranslations();
    } catch (error: any) {
      console.error('Error deleting translation:', error);
      toast({
        variant: "destructive",
        title: "Error deleting translation",
        description: error.message || "Failed to delete translation"
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