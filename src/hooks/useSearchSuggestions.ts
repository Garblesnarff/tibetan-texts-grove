import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchSuggestion {
  id: string;
  original_term: string;
  suggested_term: string;
  type: 'correction' | 'related';
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface SearchHistory {
  term: string;
  timestamp: number;
}

export const useSearchSuggestions = (searchQuery: string) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [corrections, setCorrections] = useState<string[]>([]);
  const [relatedSearches, setRelatedSearches] = useState<string[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search to history
  const addToHistory = (term: string) => {
    const newHistory = [
      { term, timestamp: Date.now() },
      ...history.filter(h => h.term !== term).slice(0, 9)
    ];
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Clear search history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Clear single history item
  const clearHistoryItem = (term: string) => {
    const newHistory = history.filter(h => h.term !== term);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Fetch suggestions from Supabase
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('search_suggestions')
          .select('*')
          .ilike('original_term', `%${searchQuery}%`)
          .order('usage_count', { ascending: false })
          .limit(5);

        if (error) throw error;

        // Validate and type-cast the suggestions
        const validSuggestions = (data || []).filter((item): item is SearchSuggestion => 
          typeof item.id === 'string' &&
          typeof item.original_term === 'string' &&
          typeof item.suggested_term === 'string' &&
          (item.type === 'correction' || item.type === 'related') &&
          typeof item.usage_count === 'number' &&
          typeof item.created_at === 'string' &&
          typeof item.updated_at === 'string'
        );

        setSuggestions(validSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  return {
    suggestions,
    corrections,
    relatedSearches,
    history,
    isLoading,
    addToHistory,
    clearHistory,
    clearHistoryItem
  };
};