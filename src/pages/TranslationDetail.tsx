import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import TranslationViewer from "@/components/TranslationViewer";

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

      <div className="max-w-6xl mx-auto">
        <TranslationViewer translation={translation} />
      </div>
    </div>
  );
}