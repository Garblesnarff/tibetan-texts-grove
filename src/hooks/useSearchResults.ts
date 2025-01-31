import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import type { Translations } from "@/integrations/supabase/types/tables";

export const useSearchResults = () => {
  const [searchResults, setSearchResults] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

      setSearchResults(data || []);
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

  return {
    searchResults,
    loading,
    error,
    fetchSearchResults
  };
};
