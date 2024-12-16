import { useEffect, useState } from "react";
import { AdminUpload } from "@/components/AdminUpload";
import { supabase } from "@/integrations/supabase/client";
import TranslationViewer from "@/components/TranslationViewer";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";

interface GroupedTranslation {
  code: string;
  translations: Translation[];
}

export default function Index() {
  const [translations, setTranslations] = useState<GroupedTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const fetchTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const groupedData = groupTranslations(data || []);
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
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}