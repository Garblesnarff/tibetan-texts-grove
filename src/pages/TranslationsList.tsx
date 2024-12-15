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

  if (!translations?.length) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Translations</h1>
          <AdminUpload />
        </div>
        <p>No translations available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Translations</h1>
        <AdminUpload />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {translations?.map((translation) => (
          <Card key={translation.id} className="flex flex-col">
            <CardHeader>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold mb-2">{translation.title}</h2>
                {translation.tibetan_title && (
                  <p className="font-tibetan text-lg mb-4">{translation.tibetan_title}</p>
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  {translation.source_file_path && (
                    <div className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Tibetan Source Available</span>
                    </div>
                  )}
                  {translation.translation_file_path && (
                    <div className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>English Translation Available</span>
                    </div>
                  )}
                </div>
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