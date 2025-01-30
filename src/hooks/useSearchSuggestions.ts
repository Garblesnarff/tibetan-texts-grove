import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SearchSuggestion {
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
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

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
          .or(`original_term.ilike.%${searchQuery}%,suggested_term.ilike.%${searchQuery}%`)
          .order('usage_count', { ascending: false })
          .limit(5);

        if (error) throw error;

        // Validate suggestion types
        const validSuggestions = data.filter((item): item is SearchSuggestion => 
          item.type === 'correction' || item.type === 'related'
        );

        setSuggestions(validSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const addToHistory = (term: string) => {
    const newHistory = [
      { term, timestamp: Date.now() },
      ...history.filter(h => h.term !== term)
    ].slice(0, 10); // Keep only 10 most recent searches
    
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const clearHistoryItem = (term: string) => {
    const newHistory = history.filter(h => h.term !== term);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  return {
    suggestions,
    history,
    isLoading,
    addToHistory,
    clearHistory,
    clearHistoryItem
  };
};