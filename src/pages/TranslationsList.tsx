import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AdminUpload } from "@/components/AdminUpload";

export default function TranslationsList() {
  const { data: translations, isLoading } = useQuery({
    queryKey: ['translations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Translations</h1>
        <AdminUpload />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {translations?.map((translation) => (
          <Card key={translation.id} className="p-4">
            <h2 className="text-xl font-semibold mb-2">{translation.title}</h2>
            {translation.tibetan_title && (
              <p className="text-gray-600 mb-4">{translation.tibetan_title}</p>
            )}
            <Button asChild>
              <Link to={`/translations/${translation.id}`}>View Translation</Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}