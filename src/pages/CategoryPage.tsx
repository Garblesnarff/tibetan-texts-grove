import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { useCategoryTranslations } from "@/hooks/useCategoryTranslations";
import { CategoryBreadcrumb } from "@/components/navigation/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Star, Clock, Eye } from "lucide-react";

const QuickFilters = ({ onFilterChange, activeFilters }) => {
  const filters = [
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'most-viewed', label: 'Most Viewed', icon: Eye },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={activeFilters.includes(id) ? "default" : "outline"}
          size="sm"
          className="transition-all duration-200"
          onClick={() => onFilterChange(id)}
        >
          <Icon className="h-4 w-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [activeFilters, setActiveFilters] = useState([]);
  
  const { 
    translations, 
    loading, 
    fetchCategoryTranslations, 
    handleDelete 
  } = useCategoryTranslations(categoryId);

  const handleFilterChange = (filterId) => {
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
          return group.translations.some(t => t.metadata?.featured === true);
        case 'recent':
          return group.translations.some(t => {
            const createdAt = t.created_at || '';
            return new Date(createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000);
          });
        case 'most-viewed':
          return group.translations.some(t => {
            const viewCount = t.metadata?.view_count || 0;
            return viewCount > 100;
          });
        default:
          return true;
      }
    });
  });

  useEffect(() => {
    fetchCategoryTranslations();
  }, [categoryId]);

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
      />
    </div>
  );
};

export default CategoryPage;