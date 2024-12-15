import { useEffect, useState } from "react";
import { AdminUpload } from "@/components/AdminUpload";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import TranslationViewer from "@/components/TranslationViewer";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [translations, setTranslations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTranslations(data || []);
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tibetan Translation Hub</h1>
        <AdminUpload />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <p>Loading translations...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {translations.length === 0 ? (
            <p>No translations found. Use the upload button to add some!</p>
          ) : (
            translations.map((translation) => (
              <TranslationViewer 
                key={translation.id} 
                translation={translation} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}