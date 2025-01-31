import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import { parseTranslation } from "@/types/translation";
import { groupTranslations } from "@/utils/translationUtils";
import { GroupedTranslation } from "@/types/groupedTranslation";

export const useSearchResults = () => {
  const [searchResults, setSearchResults] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSort, setCurrentSort] = useState("relevance:desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchSearchResults = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .textSearch('search_vector', query)
        .limit(10);

      if (error) throw error;

      const parsedResults = (data || []).map(parseTranslation);
      setSearchResults(parsedResults);
    } catch (error: any) {
      console.error('Error in fetchSearchResults:', error);
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error fetching search results",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const searchStats = {
    count: searchResults.length,
    time: 0
  };

  return {
    searchResults: groupTranslations(searchResults),
    loading,
    error,
    fetchSearchResults,
    searchQuery,
    setSearchQuery,
    currentSort,
    setCurrentSort,
    selectedTags,
    setSelectedTags,
    selectedCategory,
    setSelectedCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchStats,
    availableTags,
    isSearching: loading
  };
};