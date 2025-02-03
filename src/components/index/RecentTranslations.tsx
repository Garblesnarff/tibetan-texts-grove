import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";
import { TranslationsGrid } from "./TranslationsGrid";
import { groupTranslations } from "@/utils/translationUtils";

export const RecentTranslations = () => {
  const [translations, setTranslations] = useState<GroupedTranslation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecentTranslations = async () => {
      console.log('Fetching recent translations...');
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;

        console.log('Raw translations data:', data);

        const parsedTranslations = data as Translation[];
        console.log('Parsed translations:', parsedTranslations);

        const groupedData = groupTranslations(parsedTranslations);
        console.log('Grouped translations:', groupedData);

        setTranslations(groupedData);
      } catch (err) {
        console.error('Error fetching translations:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTranslations();
  }, []);

  return (
    <TranslationsGrid
      translations={translations}
      isLoading={isLoading}
      error={error}
      onDelete={async () => {
        // Refresh translations after delete
        setIsLoading(true);
        const { data, error } = await supabase
          .from('translations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (!error && data) {
          setTranslations(groupTranslations(data as Translation[]));
        }
        setIsLoading(false);
      }}
    />
  );
};