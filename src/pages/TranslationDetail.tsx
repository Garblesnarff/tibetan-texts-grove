import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TranslationHeader from "@/components/translation-detail/TranslationHeader";
import PDFViewer from "@/components/translation-detail/PDFViewer";
import ErrorView from "@/components/translation-detail/ErrorView";

const STORAGE_URL = "https://cnalyhtalikwsopogula.supabase.co/storage/v1/object/public/admin_translations";

export default function TranslationDetail() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: translation, isLoading, error } = useQuery({
    queryKey: ['translation', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching translation:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Translation not found');
      }
      
      return data;
    },
    meta: {
      errorHandler: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Error loading translation",
          description: error.message
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading translation...</p>
      </div>
    );
  }

  if (error || !translation) {
    return <ErrorView />;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <TranslationHeader translation={translation} />
        
        <div className="grid md:grid-cols-2 gap-6">
          {translation.source_file_path && (
            <PDFViewer
              title="Tibetan Source"
              filePath={translation.source_file_path}
              storageUrl={STORAGE_URL}
            />
          )}
          
          {translation.translation_file_path && (
            <PDFViewer
              title="English Translation"
              filePath={translation.translation_file_path}
              storageUrl={STORAGE_URL}
            />
          )}
        </div>
      </Card>
    </div>
  );
}