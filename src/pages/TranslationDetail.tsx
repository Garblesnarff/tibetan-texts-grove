import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TranslationHeader from "@/components/translation-detail/TranslationHeader";
import PDFViewerEnhanced from "@/components/pdf/PDFViewerEnhanced";
import ErrorView from "@/components/translation-detail/ErrorView";
import { parseTranslation } from "@/types/translation";
import { CategoryBreadcrumb } from "@/components/navigation/Breadcrumb";

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
      
      return parseTranslation(data);
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

  if (error) {
    return <ErrorView />;
  }

  return (
    <div className="container mx-auto p-4">
      <CategoryBreadcrumb />
      <Card className="p-6">
        <TranslationHeader 
          translation={translation!} 
          isLoading={isLoading}
        />
        
        {!isLoading && translation && (
          <div className="grid md:grid-cols-2 gap-6">
            {translation.source_file_path && (
              <PDFViewerEnhanced
                title="Tibetan Source"
                url={`${STORAGE_URL}/${translation.source_file_path}`}
              />
            )}
            
            {translation.translation_file_path && (
              <PDFViewerEnhanced
                title="English Translation"
                url={`${STORAGE_URL}/${translation.translation_file_path}`}
              />
            )}
          </div>
        )}
      </Card>
    </div>
  );
}