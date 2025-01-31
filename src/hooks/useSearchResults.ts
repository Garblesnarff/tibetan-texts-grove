import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";
import { SortConfig } from "@/types/sorting";
import { groupTranslations } from "@/utils/translationUtils";
import { useSearchParams, useNavigate } from "react-router-dom";

export const useSearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState<GroupedTranslation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>(searchParams.get("sort") || "created_at:desc");
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.get("tags")?.split(",").filter(Boolean) || []);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category") || null);
  const [startDate, setStartDate] = useState<Date | null>(searchParams.get("start") ? new Date(searchParams.get("start")!) : null);
  const [endDate, setEndDate] = useState<Date | null>(searchParams.get("end") ? new Date(searchParams.get("end")!) : null);
  const [searchStats, setSearchStats] = useState({ count: 0, time: 0 });
  const [availableTags, setAvailableTags] = useState<{ tag: string; count: number; }[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const { toast } = useToast();

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (currentSort) params.set("sort", currentSort);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    if (selectedCategory) params.set("category", selectedCategory);
    if (startDate) params.set("start", startDate.toISOString());
    if (endDate) params.set("end", endDate.toISOString());
    
    setSearchParams(params);
  }, [searchQuery, currentSort, selectedTags, selectedCategory, startDate, endDate]);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true);
      try {
        const { data, error } = await supabase
          .from('translations')
          .select('tags')
          .not('tags', 'eq', '{}');

        if (error) throw error;

        const tagCounts: { [key: string]: number } = {};
        data.forEach(translation => {
          if (translation.tags) {
            translation.tags.forEach((tag: string) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });

        const formattedTags = Object.entries(tagCounts).map(([tag, count]) => ({
          tag,
          count
        }));

        setAvailableTags(formattedTags);
      } catch (error: any) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTags();
  }, []);

  // Handle search with filtering
  useEffect(() => {
    const searchTranslations = async () => {
      if (!searchQuery.trim() && selectedTags.length === 0 && !selectedCategory && !startDate && !endDate) {
        setSearchResults([]);
        setSearchStats({ count: 0, time: 0 });
        return;
      }

      setIsSearching(true);
      const startTime = performance.now();
      
      try {
        const [field, direction] = currentSort.split(':');
        
        let query = supabase
          .from('translations')
          .select('*')
          .is('category_id', null);

        if (searchQuery) {
          query = query.textSearch('search_vector', searchQuery);
        }

        if (selectedTags.length > 0) {
          query = query.contains('tags', selectedTags);
        }

        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }

        if (startDate && endDate) {
          query = query
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());
        }

        const { data, error } = await query
          .order(field, { ascending: direction === 'asc' });

        if (error) throw error;

        const groupedResults = groupTranslations(data as Translation[]);
        const endTime = performance.now();
        
        setSearchResults(groupedResults);
        setSearchStats({
          count: data.length,
          time: Math.round(endTime - startTime) / 1000
        });
      } catch (error: any) {
        console.error('Search error:', error);
        toast({
          variant: "destructive",
          title: "Search failed",
          description: "Failed to search translations. Please try again."
        });
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(searchTranslations, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, selectedTags, selectedCategory, startDate, endDate, currentSort, toast]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    currentSort,
    setCurrentSort,
    selectedTags,
    setSelectedTags,
    selectedCategory,
    setSelectedCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchStats,
    availableTags,
    isLoadingTags
  };
};