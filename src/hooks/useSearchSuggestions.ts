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
  category_id?: string | null;
  category_title?: string;
  tag_similarity?: number;
  view_count_proximity?: number;
}

export const useSearchSuggestions = (searchQuery: string, selectedCategory?: string | null) => {
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

        // Fetch suggestions with enhanced scoring
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
          .textSearch('search_vector', term)
          .limit(20);

        if (translationsError) throw translationsError;

        // Process translations to generate suggestions
        const processedSuggestions: SearchSuggestion[] = [];
        
        if (translations) {
          for (const translation of translations) {
            const categoryMatch = selectedCategory ? translation.category_id === selectedCategory : false;
            const tagSimilarity = translation.tags ? calculateTagSimilarity(translation.tags, term) : 0;
            const viewCountProximity = calculateViewCountProximity(translation.view_count);

            const score = await supabase.rpc('calculate_suggestion_score', {
              original_term: term,
              suggested_term: translation.title,
              category_match: categoryMatch,
              tag_similarity: tagSimilarity,
              view_count_proximity: viewCountProximity,
              historical_usage: 1 // Default to 1, update based on actual usage
            });

            processedSuggestions.push({
              id: translation.id,
              original_term: term,
              suggested_term: translation.title,
              type: 'related',
              usage_count: 1,
              relevance_score: score,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              category_id: translation.category_id,
              category_title: translation.categories?.title,
              tag_similarity: tagSimilarity,
              view_count_proximity: viewCountProximity
            });
          }
        }

        // Sort by relevance score and limit to top 5
        const topSuggestions = processedSuggestions
          .sort((a, b) => b.relevance_score - a.relevance_score)
          .slice(0, 5);

        setSuggestions(topSuggestions);
        cacheSuggestions(term, topSuggestions);
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
    [selectedCategory, isOffline, toast]
  );

  const calculateTagSimilarity = (tags: string[], searchTerm: string): number => {
    if (!tags || tags.length === 0) return 0;
    
    const searchTerms = searchTerm.toLowerCase().split(' ');
    const matchingTags = tags.filter(tag => 
      searchTerms.some(term => tag.toLowerCase().includes(term))
    );
    
    return matchingTags.length / tags.length;
  };

  const calculateViewCountProximity = (viewCount: number): number => {
    const averageViewCount = 100; // You might want to calculate this dynamically
    const maxDifference = 1000;
    const difference = Math.abs(viewCount - averageViewCount);
    return Math.max(0, 1 - (difference / maxDifference));
  };

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