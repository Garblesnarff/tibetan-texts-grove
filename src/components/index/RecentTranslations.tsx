import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation, parseTranslation } from "@/types/translation";
import { TranslationsGrid } from "./TranslationsGrid";
import { groupTranslations } from "@/utils/translationUtils";

export function RecentTranslations() {
  const [recentTranslations, setRecentTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecentTranslations = async () => {
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;

        // Parse each translation to ensure proper typing
        const parsedTranslations = (data || []).map(parseTranslation);
        setRecentTranslations(parsedTranslations);
      } catch (err: any) {
        console.error('Error fetching recent translations:', err);
        setError(err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load recent translations. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTranslations();
  }, [toast]);

  const groupedTranslations = groupTranslations(recentTranslations);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRecentTranslations(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Success",
        description: "Translation deleted successfully",
      });
    } catch (err: any) {
      console.error('Error deleting translation:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete translation",
      });
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6 text-tibetan-brown">Recent Translations</h2>
      <TranslationsGrid
        translations={groupedTranslations}
        onDelete={handleDelete}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}