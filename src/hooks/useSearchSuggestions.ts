import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';
import { useOnlineStatus } from './useOnlineStatus';
import { useSearchHistory } from './useSearchHistory';
import { getCachedSuggestions, cacheSuggestions } from '@/utils/suggestionCache';
import { SearchSuggestion, SuggestionScore } from '@/types/suggestions';
import { useSuggestionAnalytics } from './useSuggestionAnalytics';

const formatSearchTerm = (term: string): string => {
  const cleaned = term.trim().toLowerCase();
  return `%${cleaned}%`;
};

export const useSearchSuggestions = (searchQuery: string, selectedCategory?: string | null) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOffline } = useOnlineStatus();
  const { history, addToHistory, clearHistory, clearHistoryItem } = useSearchHistory();
  const { toast } = useToast();
  const { trackSuggestionUsage } = useSuggestionAnalytics();

  const calculateScore = useMemo(() => {
    return (suggestion: SearchSuggestion): SuggestionScore => {
      const categoryMatchScore = suggestion.category_id === selectedCategory ? 2.0 : 0.0;
      const tagSimilarityScore = Math.min((suggestion.tag_similarity || 0) * 1.5, 1.5);
      const viewCountScore = Math.min((suggestion.view_count_proximity || 0) * 1.0, 1.0);
      const historicalUsageScore = Math.min((suggestion.usage_count / 10) * 0.5, 0.5);

      return {
        categoryMatchScore,
        tagSimilarityScore,
        viewCountScore,
        historicalUsageScore,
        totalScore: categoryMatchScore + tagSimilarityScore + viewCountScore + historicalUsageScore
      };
    };
  }, [selectedCategory]);

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
        const cached = getCachedSuggestions(term);
        if (cached) {
          setSuggestions(cached);
          setIsLoading(false);
          return;
        }

        const formattedQuery = formatSearchTerm(term);
        const { data: translations, error: translationsError } = await supabase
          .from('translations')
          .select(`
            id,
            title,
            category_id,
            tags,
            view_count,
            categories!inner (
              id,
              title
            )
          `)
          .or(`title.ilike.${formattedQuery},tibetan_title.ilike.${formattedQuery},description.ilike.${formattedQuery}`)
          .limit(20);

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
              tag_similarity: translation.tags ? calculateTagSimilarity(translation.tags, term) : 0,
              view_count_proximity: calculateViewCountProximity(translation.view_count)
            };

            const score = calculateScore(suggestion);
            suggestion.relevance_score = score.totalScore;
            processedSuggestions.push(suggestion);
          }
        }

        const sortedSuggestions = processedSuggestions
          .sort((a, b) => b.relevance_score - a.relevance_score)
          .slice(0, 5);

        setSuggestions(sortedSuggestions);
        cacheSuggestions(term, sortedSuggestions);
        
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
    [selectedCategory, isOffline, toast, calculateScore]
  );

  const calculateTagSimilarity = useCallback((tags: string[], searchTerm: string): number => {
    if (!tags || tags.length === 0) return 0;
    
    const searchTerms = searchTerm.toLowerCase().split(' ');
    const matchingTags = tags.filter(tag => 
      searchTerms.some(term => tag.toLowerCase().includes(term))
    );
    
    return matchingTags.length / tags.length;
  }, []);

  const calculateViewCountProximity = useCallback((viewCount: number): number => {
    const averageViewCount = 100;
    const maxDifference = 1000;
    const difference = Math.abs(viewCount - averageViewCount);
    return Math.max(0, 1 - (difference / maxDifference));
  }, []);

  useEffect(() => {
    fetchSuggestions(searchQuery);
    return () => {
      fetchSuggestions.cancel();
    };
  }, [searchQuery, fetchSuggestions]);

  const handleSuggestionSelect = useCallback(async (suggestion: SearchSuggestion) => {
    await trackSuggestionUsage(suggestion.id, 'selected');
    addToHistory(suggestion.suggested_term);
  }, [trackSuggestionUsage, addToHistory]);

  const retryFetch = useCallback(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    }
  }, [searchQuery, fetchSuggestions]);

  return {
    suggestions: suggestions || [],
    history: history || [],
    isLoading,
    error,
    isOffline,
    addToHistory,
    clearHistory,
    clearHistoryItem,
    retryFetch,
    handleSuggestionSelect
  };
};