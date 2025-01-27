import { useParams } from "react-router-dom";
import { CategoryBreadcrumb } from "@/components/navigation/Breadcrumb";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { useCategoryTranslations } from "@/hooks/useCategoryTranslations";
import { QuickFilters } from "@/components/filtering/QuickFilters";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { toast } = useToast();
  
  const { 
    translations, 
    loading, 
    error,
    handleDelete 
  } = useCategoryTranslations(categoryId);

  const handleFilterChange = useCallback((filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  }, []);

  // Filter translations based on active quick filters
  const filteredTranslations = translations.filter(group => {
    if (activeFilters.length === 0) return true;
    
    return activeFilters.some(filter => {
      switch (filter) {
        case 'featured':
          return group.translations.some(t => t.featured === true);
        case 'recent':
          return group.translations.some(t => {
            const createdAt = t.created_at || '';
            return new Date(createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000);
          });
        case 'most-viewed':
          return group.translations.some(t => {
            const viewCount = t.view_count || 0;
            return viewCount > 100;
          });
        default:
          return true;
      }
    });
  });

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Translations</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryBreadcrumb />
      <QuickFilters 
        onFilterChange={handleFilterChange}
        activeFilters={activeFilters}
      />
      <TranslationsGrid 
        translations={filteredTranslations}
        onDelete={handleDelete}
        isLoading={loading}
        activeCategory={categoryId}
      />
    </div>
  );
};

export default CategoryPage;