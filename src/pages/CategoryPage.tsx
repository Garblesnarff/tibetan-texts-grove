import { useParams, useNavigate } from "react-router-dom";
import { CategoryBreadcrumb } from "@/components/navigation/Breadcrumb";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { QuickFilters } from "@/components/filtering/QuickFilters";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";
import { useCategories } from "@/hooks/useCategories";
import { HorizontalCategoryList } from "@/components/navigation/category/HorizontalCategoryList";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { toast } = useToast();
  
  const { 
    categories, 
    loading,
    error,
    handleDelete 
  } = useCategories();

  const handleCategorySelect = useCallback((selectedCategoryId: string | null) => {
    if (selectedCategoryId) {
      navigate(`/category/${selectedCategoryId}`);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleFilterChange = useCallback((filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-4 border-b">
        <HorizontalCategoryList
          categories={categories}
          selectedCategory={categoryId || null}
          onCategorySelect={handleCategorySelect}
          isLoading={loading}
        />
      </div>
      <CategoryBreadcrumb />
      <QuickFilters 
        onFilterChange={handleFilterChange}
        activeFilters={activeFilters}
      />
      <TranslationsGrid 
        translations={[]} // ... keep existing code (translations data handling)
        onDelete={handleDelete}
        isLoading={loading}
        activeCategory={categoryId}
      />
    </div>
  );
};

export default CategoryPage;