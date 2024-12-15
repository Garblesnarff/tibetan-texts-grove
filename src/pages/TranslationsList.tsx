import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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

      <div className="grid gap-6 md:grid-cols-2">
        {translations?.map((translation) => (
          <Card key={translation.id} className="flex flex-col">
            <CardHeader>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">English Translation</h2>
                <h3 className="text-lg">{translation.title}</h3>
                {translation.tibetan_title && (
                  <div className="mt-4">
                    <h2 className="text-xl font-semibold text-tibetan-maroon">Tibetan Source</h2>
                    <p className="font-tibetan text-lg">{translation.tibetan_title}</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild variant="outline" className="w-full">
                <Link to={`/translations/${translation.id}`}>View Translation</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}