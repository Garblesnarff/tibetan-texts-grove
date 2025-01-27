import { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { SearchInput } from "@/components/search/SearchInput";
import { SortingControls } from "@/components/sorting/SortingControls";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";
import { SortConfig } from "@/types/sorting";
import { groupTranslations } from "@/utils/translationUtils";

export default function Index() {
  const { translations, loading: initialLoading, fetchTranslations, handleDelete } = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GroupedTranslation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("created_at:desc");
  const { toast } = useToast();

  // Initial fetch
  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  const handleSortChange = async (sortConfig: SortConfig) => {
    setIsSearching(true);
    try {
      let query = supabase
        .from('translations')
        .select('*')
        .is('category_id', null);

      if (searchQuery) {
        query = query.textSearch('search_vector', searchQuery);
      }

      const { data, error } = await query
        .order(sortConfig.field, { ascending: sortConfig.direction === 'asc' });

      if (error) throw error;
      
      const groupedResults = groupTranslations(data as Translation[]);
      setSearchResults(groupedResults);
      setCurrentSort(`${sortConfig.field}:${sortConfig.direction}`);
    } catch (error: any) {
      console.error('Sort error:', error);
      toast({
        variant: "destructive",
        title: "Error sorting translations",
        description: error.message
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search
  useEffect(() => {
    const searchTranslations = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const [field, direction] = currentSort.split(':');
        
        const { data, error } = await supabase
          .from('translations')
          .select('*')
          .textSearch('search_vector', searchQuery)
          .is('category_id', null)
          .order(field, { ascending: direction === 'asc' });

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
  }, [searchQuery, currentSort, toast]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const displayedTranslations = searchQuery ? searchResults : translations;
  const isLoading = initialLoading || isSearching;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={handleClearSearch}
        />
        <SortingControls
          onSortChange={handleSortChange}
          currentSort={currentSort}
        />
      </div>
      <TranslationsGrid
        translations={displayedTranslations}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchQuery={searchQuery}
      />
    </div>
  );
};