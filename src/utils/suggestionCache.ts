import { SearchSuggestion } from '@/types/suggestions';

const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

interface CachedSuggestions {
  data: SearchSuggestion[];
  timestamp: number;
}

export const getCachedSuggestions = (term: string): SearchSuggestion[] | null => {
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

export const cacheSuggestions = (term: string, data: SearchSuggestion[]) => {
  try {
    localStorage.setItem(`suggestions_${term}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (err) {
    console.error('Error caching suggestions:', err);
  }
};