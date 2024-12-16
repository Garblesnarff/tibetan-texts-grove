import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{translation.title}</h3>
          {translation.tibetan_title && (
            <p className="text-tibetan-maroon font-tibetan text-xl">
              {translation.tibetan_title}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {translation.source_file_path && (
            <div className="h-[800px]">
              <h4 className="font-semibold text-tibetan-brown mb-4">Tibetan Source</h4>
              <ScrollArea className="h-full border rounded-lg bg-white p-4">
                <a 
                  href={`${STORAGE_URL}/${translation.source_file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Tibetan Source PDF
                </a>
              </ScrollArea>
            </div>
          )}
          
          {translation.translation_file_path && (
            <div className="h-[800px]">
              <h4 className="font-semibold text-tibetan-brown mb-4">English Translation</h4>
              <ScrollArea className="h-full border rounded-lg bg-white p-4">
                <a 
                  href={`${STORAGE_URL}/${translation.translation_file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View English Translation PDF
                </a>
              </ScrollArea>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}