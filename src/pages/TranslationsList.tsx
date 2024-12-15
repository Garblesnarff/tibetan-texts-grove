import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AdminUpload } from "@/components/AdminUpload";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TranslationsList() {
  const queryClient = useQueryClient();
  
  const { data: translations, isLoading } = useQuery({
    queryKey: ['translations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Group translations by their base name (removing any file extensions)
      const groupedTranslations = data?.reduce((acc, translation) => {
        const baseTitle = translation.title.split('_')[0]; // Assuming titles are in format "GRAM001_source" or "GRAM001_translation"
        if (!acc[baseTitle]) {
          acc[baseTitle] = translation;
        } else {
          // Merge the files into the existing translation object
          acc[baseTitle] = {
            ...acc[baseTitle],
            source_file_path: acc[baseTitle].source_file_path || translation.source_file_path,
            translation_file_path: acc[baseTitle].translation_file_path || translation.translation_file_path,
          };
        }
        return acc;
      }, {});

      return Object.values(groupedTranslations);
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Translation deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['translations'] });
    } catch (error) {
      console.error('Error deleting translation:', error);
      toast.error("Failed to delete translation");
    }
  };

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
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">
                    {translation.title.split('_')[0]} Translation
                  </h2>
                  {translation.tibetan_title && (
                    <p className="font-tibetan text-lg">{translation.tibetan_title}</p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => handleDelete(translation.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-md bg-secondary">
                <h3 className="font-medium mb-2">Files:</h3>
                <div className="space-y-2 text-sm">
                  {translation.source_file_path ? (
                    <div className="flex items-center">
                      <span className="mr-2">📄</span>
                      <span>Tibetan Source</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-muted-foreground">
                      <span className="mr-2">❌</span>
                      <span>No Tibetan Source</span>
                    </div>
                  )}
                  {translation.translation_file_path ? (
                    <div className="flex items-center">
                      <span className="mr-2">📄</span>
                      <span>English Translation</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-muted-foreground">
                      <span className="mr-2">❌</span>
                      <span>No English Translation</span>
                    </div>
                  )}
                </div>
              </div>
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