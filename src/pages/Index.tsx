import { useEffect, useState } from "react";
import { AdminUpload } from "@/components/AdminUpload";
import { supabase } from "@/integrations/supabase/client";
import TranslationViewer from "@/components/TranslationViewer";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";

/**
 * Interface representing a group of translations sharing the same code
 * @interface GroupedTranslation
 * @property {string} code - The unique code identifier for the group
 * @property {Translation[]} translations - Array of translations in this group
 */
interface GroupedTranslation {
  code: string;
  translations: Translation[];
}

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-tibetan-maroon">Tibetan Translation Hub</h1>
        <AdminUpload />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <p>Loading translations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {translations.length === 0 ? (
            <p className="col-span-full text-center">No translations found. Use the upload button to add some!</p>
          ) : (
            translations.map((group) => (
              <TranslationViewer 
                key={group.code} 
                translations={group.translations}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}