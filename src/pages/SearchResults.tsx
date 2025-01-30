import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslations } from "@/hooks/useTranslations";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchControls } from "@/components/search/SearchControls";
import { SearchStats } from "@/components/search/SearchStats";
import { ActiveFilters } from "@/components/filtering/ActiveFilters";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";
import { SortConfig } from "@/types/sorting";
import { groupTranslations } from "@/utils/translationUtils";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("q") || "";
  
  const { translations, loading: initialLoading, handleDelete } = useTranslations();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<GroupedTranslation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("created_at:desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchStats, setSearchStats] = useState({ count: 0, time: 0 });
  const [availableTags, setAvailableTags] = useState<{ tag: string; count: number; }[]>([]);
  const { toast } = useToast();

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
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
      }
    };

    fetchTags();
  }, [translations]);

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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSearchParams({ q: value });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchParams({});
    navigate("/");
  };

  const handleSortChange = async (sortConfig: SortConfig) => {
    setCurrentSort(`${sortConfig.field}:${sortConfig.direction}`);
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleClearAll = () => {
    setSelectedTags([]);
    setSelectedCategory(null);
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
          />
          
          <SearchControls
            availableTags={availableTags}
            selectedTags={selectedTags}
            selectedCategory={selectedCategory}
            startDate={startDate}
            endDate={endDate}
            onTagSelect={handleTagSelect}
            onTagRemove={handleTagRemove}
            onCategoryChange={setSelectedCategory}
            onDateChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            onSortChange={handleSortChange}
            currentSort={currentSort}
          />
          
          <ActiveFilters
            selectedTags={selectedTags}
            selectedCategory={selectedCategory}
            startDate={startDate}
            endDate={endDate}
            resultCount={searchStats.count}
            onClearTag={handleTagRemove}
            onClearCategory={() => setSelectedCategory(null)}
            onClearDates={() => {
              setStartDate(null);
              setEndDate(null);
            }}
            onClearAll={handleClearAll}
          />

          <SearchStats
            count={searchStats.count}
            time={searchStats.time}
            showStats={!!(searchQuery || selectedTags.length > 0 || selectedCategory || startDate)}
          />
        </div>

        <TranslationsGrid
          translations={searchResults}
          onDelete={handleDelete}
          isLoading={isSearching || initialLoading}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}