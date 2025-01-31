import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';
import { useOnlineStatus } from './useOnlineStatus';
import { useSearchHistory } from './useSearchHistory';
import { getCachedSuggestions, cacheSuggestions } from '@/utils/suggestionCache';
import { SearchSuggestion } from '@/types/suggestions';
import { useSuggestionAnalytics } from './useSuggestionAnalytics';

const formatSearchTerm = (term: string): string => {
  const escaped = term.trim()
    .toLowerCase()
    .replace(/[%_]/g, '\\$&');
  return `%${escaped}%`;
};

// Utility function to calculate similarity between tags and search term
const calculateTagSimilarity = (tags: string[], searchTerm: string): number => {
  if (!tags || tags.length === 0) return 0;
  
  const termWords = searchTerm.toLowerCase().split(' ');
  let matchCount = 0;
  
  tags.forEach(tag => {
    termWords.forEach(word => {
      if (tag.toLowerCase().includes(word)) {
        matchCount++;
      }
    });
  });
  
  return matchCount / Math.max(termWords.length, tags.length);
};

// Utility function to calculate view count proximity score
const calculateViewCountProximity = (viewCount: number): number => {
  if (!viewCount) return 0;
  // Normalize view count to a 0-1 scale, with diminishing returns after 1000 views
  return Math.min(viewCount / 1000, 1);
};

// Calculate overall suggestion score
const calculateScore = (suggestion: SearchSuggestion) => {
  const titleMatchScore = suggestion.suggested_term.toLowerCase().includes(suggestion.original_term.toLowerCase()) ? 1 : 0;
  const tagScore = suggestion.tag_similarity || 0;
  const viewCountScore = suggestion.view_count_proximity || 0;
  const categoryScore = suggestion.category_title ? 0.5 : 0;

  const totalScore = (
    titleMatchScore * 2.0 +  // Title matches have highest weight
    tagScore * 1.5 +         // Tag similarity is important
    viewCountScore * 0.8 +   // View count provides social proof
    categoryScore            // Category match gives a small boost
  ) / 5.3;                   // Normalize to 0-1 range

  return {
    totalScore,
    components: {
      titleMatchScore,
      tagScore,
      viewCountScore,
      categoryScore
    }
  };
};

export const useSearchSuggestions = (searchQuery: string, selectedCategory?: string | null) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOffline } = useOnlineStatus();
  const { history, addToHistory, clearHistory, clearHistoryItem } = useSearchHistory();
  const { toast } = useToast();
  const { trackSuggestionUsage } = useSuggestionAnalytics();

  const fetchSuggestionsImpl = async (term: string) => {
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
      const cached = getCachedSuggestions(term);
      if (cached) {
        setSuggestions(cached);
        setIsLoading(false);
        return;
      }

      const formattedQuery = formatSearchTerm(term);
      
      let query = supabase
        .from('translations')
        .select(`
          id,
          title,
          category_id,
          tags,
          view_count,
          categories!inner(
            id,
            title
          )
        `);

      query = query.or([
        { title: { ilike: formattedQuery } },
        { tibetan_title: { ilike: formattedQuery } },
        { description: { ilike: formattedQuery } }
      ].map(condition => `${Object.keys(condition)[0]}.ilike.${Object.values(condition)[0].ilike}`).join(','))
      .limit(20);

      const { data: translations, error: translationsError } = await query;

      if (translationsError) throw translationsError;

      const processedSuggestions: SearchSuggestion[] = [];
      
      if (translations) {
        for (const translation of translations) {
          const suggestion: SearchSuggestion = {
            id: translation.id,
            original_term: term,
            suggested_term: translation.title,
            type: 'related',
            usage_count: 1,
            relevance_score: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category_id: translation.category_id,
            category_title: translation.categories?.title,
            tag_similarity: calculateTagSimilarity(translation.tags || [], term),
            view_count_proximity: calculateViewCountProximity(translation.view_count)
          };

          const score = calculateScore(suggestion);
          suggestion.relevance_score = score.totalScore;
          processedSuggestions.push(suggestion);
        }
      }

      setSuggestions(processedSuggestions);
      cacheSuggestions(term, processedSuggestions);
      
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
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestionsImpl, 300),
    []
  );

  useEffect(() => {
    debouncedFetchSuggestions(searchQuery);
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [searchQuery, debouncedFetchSuggestions]);

  const retryFetch = useCallback(() => {
    if (searchQuery) {
      fetchSuggestionsImpl(searchQuery);
    }
  }, [searchQuery]);

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