import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import { Clock } from "lucide-react";

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

  // Handle search with tag filtering
  useEffect(() => {
    const searchTranslations = async () => {
      if (!searchQuery.trim() && selectedTags.length === 0) {
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
  }, [searchQuery, selectedTags, currentSort, toast]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
          />
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TagFilter
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              onTagRemove={handleTagRemove}
            />
            <SortingControls
              onSortChange={handleSortChange}
              currentSort={currentSort}
            />
          </div>
          
          {(searchQuery || selectedTags.length > 0) && (
            <Alert className="bg-muted">
              <AlertDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Found {searchStats.count} results in {searchStats.time} seconds
              </AlertDescription>
            </Alert>
          )}
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