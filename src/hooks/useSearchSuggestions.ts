import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';
import { useOnlineStatus } from './useOnlineStatus';
import { useSearchHistory } from './useSearchHistory';
import { getCachedSuggestions, cacheSuggestions } from '@/utils/suggestionCache';

export interface SearchSuggestion {
  id: string;
  original_term: string;
  suggested_term: string;
  type: 'correction' | 'related';
  usage_count: number;
  relevance_score: number;
  created_at: string;
  updated_at: string;
}

export const useSearchSuggestions = (searchQuery: string) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOffline } = useOnlineStatus();
  const { history, addToHistory, clearHistory, clearHistoryItem } = useSearchHistory();
  const { toast } = useToast();

  const fetchSuggestions = useCallback(
    debounce(async (term: string) => {
      if (!term.trim() || term.length < 2) {
        setSuggestions([]);
        setError(null);
        return;
      }

      if (isOffline) {
        setError('You are currently offline. Search suggestions are not available.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Check cache first
        const cached = getCachedSuggestions(term);
        if (cached) {
          setSuggestions(cached);
          setIsLoading(false);
          return;
        }

        const { data, error: supabaseError } = await supabase
          .from('search_suggestions')
          .select('*')
          .or(`original_term.ilike.%${term}%,suggested_term.ilike.%${term}%`)
          .order('relevance_score', { ascending: false })
          .limit(5);

        if (supabaseError) throw supabaseError;

        const typedData = (data || []) as SearchSuggestion[];
        setSuggestions(typedData);
        cacheSuggestions(term, typedData);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to fetch suggestions. Please try again.');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch search suggestions. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [isOffline, toast]
  );

  useEffect(() => {
    fetchSuggestions(searchQuery);
    return () => {
      fetchSuggestions.cancel();
    };
  }, [searchQuery, fetchSuggestions]);

  const retryFetch = () => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    }
  };

  return {
    suggestions: suggestions || [],
    history: history || [],
    isLoading,
    error,
    isOffline,
    addToHistory,
    clearHistory,
    clearHistoryItem,
    retryFetch
  };
};