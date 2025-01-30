import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';
import { useOnlineStatus } from './useOnlineStatus';
import { useSearchHistory } from './useSearchHistory';
import { getCachedSuggestions, cacheSuggestions } from '@/utils/suggestionCache';

const SUGGESTION_LIMIT = 5;
const DEBOUNCE_DELAY = 300;

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

        const { data: categoryData } = await supabase
          .from('translations')
          .select('category_id')
          .textSearch('search_vector', term)
          .limit(1)
          .single();

        const { data, error: supabaseError } = await supabase
          .from('search_suggestions')
          .select('*')
          .or(`original_term.ilike.%${term}%,suggested_term.ilike.%${term}%`)
          .order('relevance_score', { ascending: false })
          .limit(SUGGESTION_LIMIT);

        if (supabaseError) throw supabaseError;

        let suggestions = data.filter((item): item is SearchSuggestion => 
          item.type === 'correction' || item.type === 'related'
        );

        if (categoryData?.category_id) {
          const { data: relatedData } = await supabase
            .from('translations')
            .select('title')
            .eq('category_id', categoryData.category_id)
            .limit(SUGGESTION_LIMIT);

          if (relatedData) {
            const relatedSuggestions: SearchSuggestion[] = relatedData.map(item => ({
              id: crypto.randomUUID(),
              original_term: term,
              suggested_term: item.title,
              type: 'related',
              usage_count: 0,
              relevance_score: 1.0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }));
            suggestions = [...suggestions, ...relatedSuggestions].slice(0, SUGGESTION_LIMIT);
          }
        }

        setSuggestions(suggestions);
        cacheSuggestions(term, suggestions);
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
    }, DEBOUNCE_DELAY),
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
    suggestions,
    history,
    isLoading,
    error,
    isOffline,
    addToHistory,
    clearHistory,
    clearHistoryItem,
    retryFetch
  };
};