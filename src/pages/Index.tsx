import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";
import { Header } from "@/components/index/Header";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";

/**
 * Index Page Component
 * Main page displaying all translations grouped by their codes
 * Includes functionality for viewing, managing, and deleting translations
 */
export default function Index() {
  // State management for translations and loading status
  const [translations, setTranslations] = useState<GroupedTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Groups translations by their code (first word of the title)
   * @param {Translation[]} data - Array of translations to be grouped
   * @returns {GroupedTranslation[]} Array of grouped translations
   */
  const groupTranslations = (data: Translation[]): GroupedTranslation[] => {
    const groups: { [key: string]: Translation[] } = {};
    
    data.forEach(translation => {
      const code = translation.title.split(' ')[0];
      if (!groups[code]) {
        groups[code] = [];
      }
      groups[code].push(translation);
    });

    return Object.entries(groups).map(([code, translations]) => ({
      code,
      translations
    }));
  };

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

  /**
   * Fetches all translations from the database and groups them
   * @returns {Promise<void>}
   */
  const fetchTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
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
  };

  // Fetch translations on component mount
  useEffect(() => {
    fetchTranslations();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <TranslationsGrid 
        translations={translations}
        onDelete={handleDelete}
        isLoading={loading}
      />
    </div>
  );
}