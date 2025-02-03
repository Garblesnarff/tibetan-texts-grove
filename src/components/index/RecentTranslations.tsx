import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Translation } from "@/types/translation";
import { groupTranslations } from "@/utils/translationUtils";
import { TranslationsGrid } from "./TranslationsGrid";
import { useToast } from "@/hooks/use-toast";
import { parseTranslation } from "@/types/translation";

export function RecentTranslations() {
  const [recentTranslations, setRecentTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchRecentTranslations = async () => {
    try {
      console.log('Fetching recent translations...');
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      console.log('Raw translations data:', data);
      const parsedTranslations = (data || []).map(parseTranslation);
      console.log('Parsed translations:', parsedTranslations);
      setRecentTranslations(parsedTranslations);
    } catch (err: any) {
      console.error('Error fetching recent translations:', err);
      setError(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load recent translations"
      });
    } finally {
      setIsLoading(false);
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

      fetchRecentTranslations();
    } catch (err: any) {
      console.error('Error deleting translation:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete translation"
      });
    }
  };

  useEffect(() => {
    fetchRecentTranslations();
  }, []);

  const groupedTranslations = groupTranslations(recentTranslations);
  console.log('Grouped translations:', groupedTranslations);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6 text-tibetan-brown">Recent Translations</h2>
      <TranslationsGrid
        translations={groupedTranslations}
        onDelete={handleDelete}
        isLoading={isLoading}
        error={error || undefined}
      />
    </div>
  );
}