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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <CategoryBreadcrumb />
      <Card className="p-4 sm:p-6 lg:p-8">
        <TranslationHeader 
          translation={translation!} 
          isLoading={isLoading}
        />
        
        {!isLoading && translation && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6">
            {translation.source_file_path && (
              <div className="w-full min-h-[600px] lg:min-h-[700px]">
                <PDFViewerEnhanced
                  title="Tibetan Source"
                  url={`${STORAGE_URL}/${translation.source_file_path}`}
                />
              </div>
            )}
            
            {translation.translation_file_path && (
              <div className="w-full min-h-[600px] lg:min-h-[700px]">
                <PDFViewerEnhanced
                  title="English Translation"
                  url={`${STORAGE_URL}/${translation.translation_file_path}`}
                />
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}