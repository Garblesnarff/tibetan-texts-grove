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
import { HomeSection } from "@/components/index/HomeSection";
import { Star, Clock, Eye } from "lucide-react";

export default function Index() {
  // Featured translations
  const { 
    translations: featuredTranslations,
    loading: featuredLoading,
    error: featuredError,
    fetchTranslations: fetchFeatured,
    handleDelete: handleDeleteFeatured
  } = useTranslations();

  // Recent translations
  const {
    translations: recentTranslations,
    loading: recentLoading,
    error: recentError,
    fetchTranslations: fetchRecent,
    handleDelete: handleDeleteRecent
  } = useTranslations();

  // Popular translations
  const {
    translations: popularTranslations,
    loading: popularLoading,
    error: popularError,
    fetchTranslations: fetchPopular,
    handleDelete: handleDeletePopular
  } = useTranslations();

  // Regular search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GroupedTranslation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("created_at:desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<{ tag: string; count: number; }[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch data for each section on mount
  useEffect(() => {
    fetchFeatured({ featured: true, limit: 4 });
    fetchRecent({ sortBy: 'created_at:desc', limit: 4 });
    fetchPopular({ sortBy: 'view_count:desc', limit: 4 });
  }, [fetchFeatured, fetchRecent, fetchPopular]);

  // Handle sort change
  const handleSortChange = (config: SortConfig) => {
    setCurrentSort(`${config.field}:${config.direction}`);
  };

  // Create async delete handlers for each section
  const handleFeaturedDelete = async (id: string) => {
    await handleDeleteFeatured(id);
  };

  const handleRecentDelete = async (id: string) => {
    await handleDeleteRecent(id);
  };

  const handlePopularDelete = async (id: string) => {
    await handleDeletePopular(id);
  };

  const handleSearchDelete = async (id: string) => {
    // Implement search results delete logic if needed
    return Promise.resolve();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />
          <SortingControls
            onSortChange={handleSortChange}
            currentSort={currentSort}
          />
        </div>
        <TagFilter
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagSelect={(tag) => setSelectedTags([...selectedTags, tag])}
          onTagRemove={(tag) => setSelectedTags(selectedTags.filter(t => t !== tag))}
        />
        <QuickFilters
          onFilterChange={(filterId) => {
            setActiveFilters(prev =>
              prev.includes(filterId)
                ? prev.filter(f => f !== filterId)
                : [...prev, filterId]
            );
          }}
          activeFilters={activeFilters}
        />
      </div>

      {!searchQuery && !selectedTags.length && !activeFilters.length && (
        <>
          <HomeSection title="Featured Translations" icon={Star}>
            <TranslationsGrid
              translations={featuredTranslations}
              onDelete={handleFeaturedDelete}
              isLoading={featuredLoading}
              error={featuredError}
            />
          </HomeSection>

          <HomeSection title="Recently Added" icon={Clock}>
            <TranslationsGrid
              translations={recentTranslations}
              onDelete={handleRecentDelete}
              isLoading={recentLoading}
              error={recentError}
            />
          </HomeSection>

          <HomeSection title="Most Popular" icon={Eye}>
            <TranslationsGrid
              translations={popularTranslations}
              onDelete={handlePopularDelete}
              isLoading={popularLoading}
              error={popularError}
            />
          </HomeSection>
        </>
      )}

      {(searchQuery || selectedTags.length > 0 || activeFilters.length > 0) && (
        <TranslationsGrid
          translations={searchResults}
          onDelete={handleSearchDelete}
          isLoading={isSearching}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}