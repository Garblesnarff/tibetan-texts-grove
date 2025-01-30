import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';

const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour
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

interface SearchHistory {
  term: string;
  timestamp: number;
}

interface CachedSuggestions {
  data: SearchSuggestion[];
  timestamp: number;
}

export const useSearchSuggestions = (searchQuery: string) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load search history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error('Error loading search history:', err);
    }
  }, []);

  // Check cache for suggestions
  const getCachedSuggestions = (term: string): SearchSuggestion[] | null => {
    try {
      const cached = localStorage.getItem(`suggestions_${term}`);
      if (cached) {
        const { data, timestamp }: CachedSuggestions = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return data;
        }
        localStorage.removeItem(`suggestions_${term}`);
      }
    } catch (err) {
      console.error('Error reading cache:', err);
    }
    return null;
  };

  // Cache suggestions
  const cacheSuggestions = (term: string, data: SearchSuggestion[]) => {
    try {
      localStorage.setItem(`suggestions_${term}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error('Error caching suggestions:', err);
    }
  };

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(
    debounce(async (term: string) => {
      if (!term.trim() || term.length < 2) {
        setSuggestions([]);
        setError(null);
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
          .limit(SUGGESTION_LIMIT);

        if (supabaseError) throw supabaseError;

        const validSuggestions = data.filter((item): item is SearchSuggestion => 
          item.type === 'correction' || item.type === 'related'
        );

        setSuggestions(validSuggestions);
        cacheSuggestions(term, validSuggestions);
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
    []
  );

  useEffect(() => {
    fetchSuggestions(searchQuery);
    return () => {
      fetchSuggestions.cancel();
    };
  }, [searchQuery, fetchSuggestions]);

  const addToHistory = useCallback((term: string) => {
    setHistory(prevHistory => {
      const newHistory = [
        { term, timestamp: Date.now() },
        ...prevHistory.filter(h => h.term !== term)
      ].slice(0, 10);
      
      try {
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      } catch (err) {
        console.error('Error saving search history:', err);
      }
      
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('searchHistory');
    } catch (err) {
      console.error('Error clearing search history:', err);
    }
  }, []);

  const clearHistoryItem = useCallback((term: string) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(h => h.term !== term);
      try {
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      } catch (err) {
        console.error('Error updating search history:', err);
      }
      return newHistory;
    });
  }, []);

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
    addToHistory,
    clearHistory,
    clearHistoryItem,
    retryFetch
  };
};