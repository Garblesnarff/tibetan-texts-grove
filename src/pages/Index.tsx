import { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { SearchInput } from "@/components/search/SearchInput";
import { SortingControls } from "@/components/sorting/SortingControls";
import { TagFilter } from "@/components/filtering/TagFilter";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";
import { groupTranslations } from "@/utils/translationUtils";
import { QuickFilters } from "@/components/filtering/QuickFilters";
import { SortConfig } from "@/types/sorting";

interface TagCount {
  tag: string;
  count: number;
}

export default function Index() {
  const { translations, loading: initialLoading, fetchTranslations, handleDelete } = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GroupedTranslation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("created_at:desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<TagCount[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { toast } = useToast();

  // Handle quick filter changes
  const handleFilterChange = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  // Add the missing handleSortChange function
  const handleSortChange = (config: SortConfig) => {
    setCurrentSort(`${config.field}:${config.direction}`);
  };

  useEffect(() => {
    const fetchFilteredTranslations = async () => {
      try {
        setIsSearching(true);
        let query = supabase
          .from('translations')
          .select('*')
          .is('category_id', null);

        // Apply filters
        if (activeFilters.includes('featured')) {
          query = query.eq('featured', true);
        }
        if (activeFilters.includes('recent')) {
          query = query.order('created_at', { ascending: false }).limit(6);
        }
        if (activeFilters.includes('most-viewed')) {
          query = query.order('view_count', { ascending: false }).limit(6);
        }

        const { data, error } = await query;

        if (error) throw error;
        
        const groupedResults = groupTranslations(data as Translation[]);
        setSearchResults(groupedResults);
      } catch (error: any) {
        console.error('Filter error:', error);
        toast({
          variant: "destructive",
          title: "Error filtering translations",
          description: error.message
        });
      } finally {
        setIsSearching(false);
      }
    };

    if (activeFilters.length > 0) {
      fetchFilteredTranslations();
    } else {
      setSearchResults([]);
    }
  }, [activeFilters, toast]);

  // Handle search with tag filtering
  useEffect(() => {
    const searchTranslations = async () => {
      if (!searchQuery.trim() && selectedTags.length === 0) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
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

        const { data, error } = await query
          .order(field, { ascending: direction === 'asc' });

        if (error) throw error;

        const groupedResults = groupTranslations(data as Translation[]);
        setSearchResults(groupedResults);
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
  }, [searchQuery, selectedTags, currentSort, toast]);

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

        const formattedTags: TagCount[] = Object.entries(tagCounts).map(([tag, count]) => ({
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

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const displayedTranslations = searchQuery || selectedTags.length > 0 || activeFilters.length > 0
    ? searchResults 
    : translations;
  const isLoading = initialLoading || isSearching;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={handleClearSearch}
          />
          <SortingControls
            onSortChange={handleSortChange}
            currentSort={currentSort}
          />
        </div>
        <TagFilter
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
        />
        <QuickFilters
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
        />
      </div>
      <TranslationsGrid
        translations={displayedTranslations}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchQuery={searchQuery}
      />
    </div>
  );
}
