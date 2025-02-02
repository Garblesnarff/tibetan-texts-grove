import { useState, useEffect, KeyboardEvent } from "react";
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
    fetchTranslations: fetchFeatured
  } = useTranslations({ featured: true, limit: 4 });

  const {
    translations: recentTranslations,
    loading: recentLoading,
    error: recentError,
    fetchTranslations: fetchRecent
  } = useTranslations({ orderBy: 'created_at', limit: 6 });

  const {
    translations: popularTranslations,
    loading: popularLoading,
    error: popularError,
    fetchTranslations: fetchPopular
  } = useTranslations({ orderBy: 'view_count', limit: 6 });

  useEffect(() => {
    console.log('Fetching initial data');
    fetchFeatured();
    fetchRecent();
    fetchPopular();
  }, [fetchFeatured, fetchRecent, fetchPopular]);

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
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Header />
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
            className="ml-auto"
          >
            <Settings className="h-5 w-5" />
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
          onDelete={fetchFeatured}
        />
      </section>

      {/* Recent Translations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-tibetan-brown">Recently Added</h2>
        <TranslationsGrid
          translations={recentTranslations}
          isLoading={recentLoading}
          error={recentError}
          onDelete={fetchRecent}
        />
      </section>

      {/* Popular Translations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-tibetan-brown">Most Popular</h2>
        <TranslationsGrid
          translations={popularTranslations}
          isLoading={popularLoading}
          error={popularError}
          onDelete={fetchPopular}
        />
      </section>
    </div>
  );
}