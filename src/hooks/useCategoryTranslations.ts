import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation, parseTranslation } from "@/types/translation";
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
      console.log('Fetching translations for category:', categoryId);
      
      const { data: translationsData, error: translationsError } = await supabase
        .from('translations')
        .select('*')
        .eq('category_id', categoryId);

      if (translationsError) throw translationsError;

      console.log('Fetched translations:', translationsData);
      
      const parsedTranslations = translationsData.map(parseTranslation);
      const groupedData = groupTranslations(parsedTranslations);
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