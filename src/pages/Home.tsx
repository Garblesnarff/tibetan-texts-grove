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
    handleDelete,
    fetchTranslations: fetchFeatured
  } = useTranslations();

  const {
    translations: recentTranslations,
    loading: recentLoading,
  } = useTranslations();

  const {
    translations: popularTranslations,
    loading: popularLoading,
  } = useTranslations();

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

  const handleClear = () => {
    setSearchQuery("");
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
            <span className="sr-only">Admin Settings</span>
          </Button>
        )}
      </div>

      <div className="mt-8 mb-12">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onKeyDown={handleKeyDown}
          onClear={handleClear}
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
          translations={featuredTranslations.filter(t => t.featured).slice(0, 4)}
          isLoading={featuredLoading}
          onDelete={handleDelete}
        />
      </section>

      {/* Recent Translations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-tibetan-brown">Recently Added</h2>
        <TranslationsGrid
          translations={recentTranslations.sort((a, b) => 
            new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
          ).slice(0, 6)}
          isLoading={recentLoading}
          onDelete={handleDelete}
        />
      </section>

      {/* Popular Translations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-tibetan-brown">Most Popular</h2>
        <TranslationsGrid
          translations={popularTranslations.sort((a, b) => 
            (b.view_count || 0) - (a.view_count || 0)
          ).slice(0, 6)}
          isLoading={popularLoading}
          onDelete={handleDelete}
        />
      </section>
    </div>
  );
}