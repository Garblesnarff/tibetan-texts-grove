import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

const STORAGE_URL = "https://cnalyhtalikwsopogula.supabase.co/storage/v1/object/public/admin_translations";

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
    return (
      <div className="container mx-auto p-4">
        <p>Loading translation...</p>
      </div>
    );
  }

  if (!translation) {
    return (
      <div className="container mx-auto p-4">
        <p>Translation not found</p>
      </div>
    );
  }

  const code = translation.title.split(' ')[0];

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{code} Translation</h1>
          {translation.tibetan_title && (
            <p className="text-tibetan-maroon font-tibetan text-xl mb-2">
              {translation.tibetan_title}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {translation.source_file_path && (
            <div className="h-[800px]">
              <h4 className="font-semibold text-tibetan-brown mb-4">Tibetan Source</h4>
              <div className="h-full border rounded-lg bg-white p-4">
                <a 
                  href={`${STORAGE_URL}/${translation.source_file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block mb-4"
                >
                  View Tibetan Source PDF
                </a>
                <iframe
                  src={`${STORAGE_URL}/${translation.source_file_path}`}
                  className="w-full h-full border-0"
                  title="Tibetan Source PDF"
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
              </div>
            </div>
          )}
          
          {translation.translation_file_path && (
            <div className="h-[800px]">
              <h4 className="font-semibold text-tibetan-brown mb-4">English Translation</h4>
              <div className="h-full border rounded-lg bg-white p-4">
                <a 
                  href={`${STORAGE_URL}/${translation.translation_file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block mb-4"
                >
                  View English Translation PDF
                </a>
                <iframe
                  src={`${STORAGE_URL}/${translation.translation_file_path}`}
                  className="w-full h-full border-0"
                  title="English Translation PDF"
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}