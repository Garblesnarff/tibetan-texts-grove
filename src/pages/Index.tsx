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
import { SortConfig } from "@/types/sorting";
import { groupTranslations } from "@/utils/translationUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TagCount {
  tag: string;
  count: number;
}

export default function Index() {
  console.log('Index component mounted');

  const { translations, loading: initialLoading, error: translationsError, fetchTranslations, handleDelete } = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GroupedTranslation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("created_at:desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<TagCount[]>([]);
  const { toast } = useToast();

  // Fetch available tags
  useEffect(() => {
    console.log('Fetching tags');
    const fetchTags = async () => {
      try {
        if (!supabase) {
          console.error('Supabase client not initialized');
          return;
        }

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
        toast({
          variant: "destructive",
          title: "Error fetching tags",
          description: error.message
        });
      }
    };

    fetchTags();
  }, [translations, toast]);

  const handleSortChange = async (sortConfig: SortConfig) => {
    console.log('Handling sort change:', sortConfig);
    setIsSearching(true);
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

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
        .order(sortConfig.field, { ascending: sortConfig.direction === 'asc' });

      if (error) throw error;
      
      const groupedResults = groupTranslations(data as Translation[]);
      setSearchResults(groupedResults);
      setCurrentSort(`${sortConfig.field}:${sortConfig.direction}`);
    } catch (error: any) {
      console.error('Sort error:', error);
      toast({
        variant: "destructive",
        title: "Error sorting translations",
        description: error.message
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search with tag filtering
  useEffect(() => {
    console.log('Search effect triggered:', { searchQuery, selectedTags });
    const searchTranslations = async () => {
      if (!searchQuery.trim() && selectedTags.length === 0) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }

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

  const displayedTranslations = searchQuery || selectedTags.length > 0 ? searchResults : translations;
  const isLoading = initialLoading || isSearching;

  if (translationsError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load translations. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

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
      </div>
      <TranslationsGrid
        translations={displayedTranslations}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchQuery={searchQuery}
        error={translationsError}
      />
    </div>
  );
}