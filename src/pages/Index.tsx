import { useState } from "react";
import { SearchInput } from "@/components/search/SearchInput";
import { SortingControls } from "@/components/sorting/SortingControls";
import { TagFilter } from "@/components/filtering/TagFilter";
import { RecentTranslations } from "@/components/index/RecentTranslations";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentSort, setCurrentSort] = useState<string>("created_at:desc");
  const { toast } = useToast();
  
  const {
    searchResults,
    isSearching,
    currentSort: searchSort,
    setCurrentSort: setSearchSort,
    selectedTags: searchTags,
    setSelectedTags: setSearchTags,
    searchQuery: searchTerm,
    setSearchQuery: setSearchTerm
  } = useSearchResults();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation deleted successfully"
      });

      if (searchQuery || selectedTags.length > 0) {
        // Refresh search results if needed
        setSearchQuery(searchQuery);
      }
    } catch (err: any) {
      console.error('Error deleting translation:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete translation"
      });
    }
  };

  const handleSortChange = async (sortConfig: { field: string; direction: 'asc' | 'desc' }) => {
    const sortString = `${sortConfig.field}:${sortConfig.direction}`;
    setCurrentSort(sortString);
    setSearchSort(sortString);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSearchTerm("");
    setSearchTags([]);
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setSearchTags(newTags);
    }
  };

  const handleTagRemove = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    setSearchTags(newTags);
  };

  const isSearchActive = searchQuery.trim().length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setSearchTerm(value);
            }}
            onClear={handleClearSearch}
          />
          <SortingControls
            onSortChange={handleSortChange}
            currentSort={currentSort}
          />
        </div>
        <TagFilter
          availableTags={[]} // You might want to fetch these from the server
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
        />
      </div>
      
      {isSearchActive ? (
        <TranslationsGrid
          translations={searchResults}
          onDelete={handleDelete}
          isLoading={isSearching}
          searchQuery={searchQuery}
        />
      ) : (
        <RecentTranslations />
      )}
    </div>
  );
}