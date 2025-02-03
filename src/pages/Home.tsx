import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "@/components/search/SearchInput";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { QuickFilters } from "@/components/filtering/QuickFilters";
import { Header } from "@/components/index/Header";
import { supabase } from "@/integrations/supabase/client";
import { Translation, parseTranslation } from "@/types/translation";
import { groupTranslations } from "@/utils/translationUtils";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleFilterChange = (filterId: string) => {
    console.log('Filter changed:', filterId);
    setActiveFilters(prev => {
      const newFilters = prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId];
      console.log('Active filters changed:', newFilters);
      return newFilters;
    });
  };

  const fetchTranslations = async () => {
    try {
      console.log('Fetching translations with filters...', activeFilters);
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('translations')
        .select('*')
        .limit(6);

      if (activeFilters.includes('featured')) {
        query = query.eq('featured', true);
      }
      if (activeFilters.includes('recent')) {
        query = query.order('created_at', { ascending: false });
      }
      if (activeFilters.includes('most-viewed')) {
        query = query.order('view_count', { ascending: false });
      }
      if (!activeFilters.includes('recent') && !activeFilters.includes('most-viewed')) {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('Translations fetched:', data);
      setTranslations(data ? data.map(parseTranslation) : []);
    } catch (err) {
      console.error('Error fetching translations:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch translations'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, [activeFilters]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchTranslations();
    } catch (err) {
      console.error('Error deleting translation:', err);
    }
  };

  const groupedTranslations = groupTranslations(translations);

  return (
    <div className="space-y-6">
      <Header />
      
      <div className="max-w-2xl mx-auto w-full">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
      </div>

      <QuickFilters
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />

      <TranslationsGrid
        translations={groupedTranslations}
        onDelete={handleDelete}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}