import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/index/Header";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { CategorySidebar } from "@/components/navigation/CategorySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [translations, setTranslations] = useState<GroupedTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategoryTranslations = async () => {
    try {
      console.log('Fetching translations for category:', categoryId);
      
      const { data: translationsData, error: translationsError } = await supabase
        .from('translations')
        .select('*')
        .eq('category_id', categoryId);

      if (translationsError) throw translationsError;

      console.log('Fetched translations:', translationsData);

      // Group translations by their code (first word of title)
      const grouped = translationsData.reduce((acc: GroupedTranslation[], translation: Translation) => {
        const code = translation.title.split(' ')[0];
        const existingGroup = acc.find(group => group.code === code);
        
        if (existingGroup) {
          existingGroup.translations.push(translation);
        } else {
          acc.push({
            code,
            translations: [translation]
          });
        }
        
        return acc;
      }, []);

      setTranslations(grouped);
    } catch (error: any) {
      console.error('Error fetching translations:', error);
      toast({
        variant: "destructive",
        title: "Error fetching translations",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation deleted successfully"
      });

      fetchCategoryTranslations();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting translation",
        description: error.message
      });
    }
  };

  useEffect(() => {
    fetchCategoryTranslations();
  }, [categoryId]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-amber-50 to-orange-100">
        <CategorySidebar />
        <main className="flex-1 px-4 py-8">
          <div className="container mx-auto">
            <Header />
            <TranslationsGrid 
              translations={translations}
              onDelete={handleDelete}
              isLoading={loading}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}