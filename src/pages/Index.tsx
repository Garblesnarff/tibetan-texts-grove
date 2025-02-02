import { useEffect, useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { SearchInput } from "@/components/search/SearchInput";
import { SortingControls } from "@/components/sorting/SortingControls";
import { TagFilter } from "@/components/filtering/TagFilter";
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
    fetchTranslations: fetchFeatured
  } = useTranslations();

  // Recent translations
  const {
    translations: recentTranslations,
    loading: recentLoading,
    error: recentError,
    fetchTranslations: fetchRecent
  } = useTranslations();

  // Popular translations
  const {
    translations: popularTranslations,
    loading: popularLoading,
    error: popularError,
    fetchTranslations: fetchPopular
  } = useTranslations();

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSort, setCurrentSort] = useState<string>("created_at:desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<{ tag: string; count: number; }[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Fetch data for each section on mount
  useEffect(() => {
    console.log('Fetching initial data for sections');
    fetchFeatured({ featured: true, limit: 4 });
    fetchRecent({ sortBy: 'created_at:desc', limit: 4 });
    fetchPopular({ sortBy: 'view_count:desc', limit: 4 });
  }, [fetchFeatured, fetchRecent, fetchPopular]);

  // Handle sort change
  const handleSortChange = (config: SortConfig) => {
    setCurrentSort(`${config.field}:${config.direction}`);
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

      {/* Search Results */}
      {searchQuery && (
        <TranslationsGrid
          translations={searchResults}
          onDelete={async () => {}}
          isLoading={isSearching}
          searchQuery={searchQuery}
        />
      )}

      {/* Main Sections */}
      <HomeSection title="Featured Translations" icon={Star}>
        <TranslationsGrid
          translations={featuredTranslations}
          onDelete={async () => {}}
          isLoading={featuredLoading}
          error={featuredError}
        />
      </HomeSection>

      <HomeSection title="Recently Added" icon={Clock}>
        <TranslationsGrid
          translations={recentTranslations}
          onDelete={async () => {}}
          isLoading={recentLoading}
          error={recentError}
        />
      </HomeSection>

      <HomeSection title="Most Popular" icon={Eye}>
        <TranslationsGrid
          translations={popularTranslations}
          onDelete={async () => {}}
          isLoading={popularLoading}
          error={popularError}
        />
      </HomeSection>
    </div>
  );
}