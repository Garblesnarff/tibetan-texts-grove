import { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { SearchInput } from "@/components/search/SearchInput";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Translation } from "@/types/translation";
import { groupTranslations } from "@/utils/translationUtils";
import { GroupedTranslation } from "@/types/groupedTranslation";

export default function Index() {
  const { translations, loading: initialLoading, fetchTranslations, handleDelete } = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GroupedTranslation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Initial fetch
  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  // Handle search
  useEffect(() => {
    const searchTranslations = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('*')
          .textSearch('search_vector', searchQuery)
          .is('category_id', null);

        if (error) throw error;

        const groupedResults = groupTranslations(data as Translation[]);
        setSearchResults(groupedResults);
      } catch (error: any) {
        console.error('Search error:', error);
        toast({
          variant: "destructive",
          title: "Search failed",
          description: "Failed to search translations. Please try again."
        });
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(searchTranslations, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, toast]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const displayedTranslations = searchQuery ? searchResults : translations;
  const isLoading = initialLoading || isSearching;

  return (
    <>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={handleClearSearch}
      />
      <TranslationsGrid
        translations={displayedTranslations}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </>
  );
}