import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TranslationViewer from "@/components/TranslationViewer";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";

/**
 * Translations Page Component
 * Displays a list of all uploaded translations
 */
export default function Translations() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Fetches all translations from the database
   */
  const fetchTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTranslations(data as Translation[]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching translations",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading translations...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Translations</h1>
      <div className="space-y-6">
        {translations.length === 0 ? (
          <p>No translations found.</p>
        ) : (
          translations.map((translation) => (
            <TranslationViewer 
              key={translation.id} 
              translations={[translation]} 
              onUpdate={fetchTranslations}
            />
          ))
        )}
      </div>
    </div>
  );
}