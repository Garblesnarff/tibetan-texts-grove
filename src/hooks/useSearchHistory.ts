import { useState, useEffect, useCallback } from 'react';

export interface SearchHistory {
  term: string;
  timestamp: number;
}

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistory[]>([]);

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

  return {
    history,
    addToHistory,
    clearHistory,
    clearHistoryItem
  };
};