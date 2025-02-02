import { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/index/Header";
import { SearchInput } from "@/components/search/SearchInput";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { QuickFilters } from "@/components/filtering/QuickFilters";
import { useTranslations } from "@/hooks/useTranslations";
import { useAuth } from "@/hooks/useAuth";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { isAdmin } = useAuth();
  
  const {
    translations: featuredTranslations,
    loading: featuredLoading,
    error: featuredError,
    handleDelete: handleFeaturedDelete,
    fetchTranslations: fetchFeatured
  } = useTranslations({
    filters: { featured: true },
    limit: 4,
    orderBy: { column: 'created_at', order: 'desc' }
  });

  const {
    translations: recentTranslations,
    loading: recentLoading,
    error: recentError,
    handleDelete: handleRecentDelete,
    fetchTranslations: fetchRecent
  } = useTranslations({
    limit: 6,
    orderBy: { column: 'created_at', order: 'desc' }
  });

  const {
    translations: popularTranslations,
    loading: popularLoading,
    error: popularError,
    handleDelete: handlePopularDelete,
    fetchTranslations: fetchPopular
  } = useTranslations({
    limit: 6,
    orderBy: { column: 'view_count', order: 'desc' }
  });

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <Header />
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
            className="ml-auto hover:bg-tibetan-brown/10"
          >
            <Settings className="h-5 w-5 text-tibetan-brown" />
          </Button>
        )}
      </div>

      <div className="mt-8 mb-12">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onKeyDown={handleKeyDown}
          onClear={() => setSearchQuery("")}
        />
      </div>

      <QuickFilters
        onFilterChange={handleFilterChange}
        activeFilters={activeFilters}
      />

      {/* Featured Translations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-tibetan-brown">Featured Translations</h2>
        <TranslationsGrid
          translations={featuredTranslations}
          isLoading={featuredLoading}
          error={featuredError}
          onDelete={handleFeaturedDelete}
        />
      </section>

      {/* Recent Translations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-tibetan-brown">Recently Added</h2>
        <TranslationsGrid
          translations={recentTranslations}
          isLoading={recentLoading}
          error={recentError}
          onDelete={handleRecentDelete}
        />
      </section>

      {/* Popular Translations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-tibetan-brown">Most Popular</h2>
        <TranslationsGrid
          translations={popularTranslations}
          isLoading={popularLoading}
          error={popularError}
          onDelete={handlePopularDelete}
        />
      </section>
    </div>
  );
}