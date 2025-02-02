import { useNavigate } from "react-router-dom";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchControls } from "@/components/search/SearchControls";
import { SearchStats } from "@/components/search/SearchStats";
import { ActiveFilters } from "@/components/filtering/ActiveFilters";
import { useTranslations } from "@/hooks/useTranslations";
import { useSearchResults } from "@/hooks/useSearchResults";
import { SortConfig } from "@/types/sorting";
import { Header } from "@/components/index/Header";

export default function SearchResults() {
  const navigate = useNavigate();
  const { handleDelete } = useTranslations();
  const {
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
    availableTags
  } = useSearchResults();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    navigate("/");
  };

  const handleSortChange = (sortConfig: SortConfig) => {
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
      <Header />
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
          isLoading={isSearching}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}