import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const STORAGE_URL = "https://cnalyhtalikwsopogula.supabase.co/storage/v1/object/public";

export default function TranslationDetail() {
  const { id } = useParams();

  const { data: translation, isLoading } = useQuery({
    queryKey: ['translation', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!translation) {
    return <div className="container mx-auto p-4">Translation not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/translations">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Translations
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{translation.title}</h1>
        {translation.tibetan_title && (
          <h2 className="text-xl text-gray-600 mb-6">{translation.tibetan_title}</h2>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {translation.source_file_path && (
            <div>
              <h3 className="font-semibold mb-2">Tibetan Source</h3>
              <Button asChild>
                <a href={`${STORAGE_URL}/admin_translations/${translation.source_file_path}`} target="_blank" rel="noopener noreferrer">
                  View Source PDF
                </a>
              </Button>
            </div>
          )}

          {translation.translation_file_path && (
            <div>
              <h3 className="font-semibold mb-2">English Translation</h3>
              <Button asChild>
                <a href={`${STORAGE_URL}/admin_translations/${translation.translation_file_path}`} target="_blank" rel="noopener noreferrer">
                  View Translation PDF
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}