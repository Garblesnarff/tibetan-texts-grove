import { useParams } from "react-router-dom";
import { CategoryBreadcrumb } from "@/components/navigation/Breadcrumb";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { useCategoryTranslations } from "@/hooks/useCategoryTranslations";
import { QuickFilters } from "@/components/filtering/QuickFilters";
import { useState, useEffect } from "react";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const { 
    translations, 
    loading, 
    fetchCategoryTranslations, 
    handleDelete 
  } = useCategoryTranslations(categoryId);

  useEffect(() => {
    if (categoryId) {
      console.log('Fetching translations for category:', categoryId);
      fetchCategoryTranslations();
    }
  }, [categoryId, fetchCategoryTranslations]);

  const handleFilterChange = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

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