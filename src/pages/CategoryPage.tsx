import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { useCategoryTranslations } from "@/hooks/useCategoryTranslations";

/**
 * CategoryPage Component
 * Displays translations filtered by category with a sidebar navigation
 * 
 * @component
 * @returns {JSX.Element} The rendered category page
 */
const CategoryPage = () => {
  // Get category ID from URL parameters
  const { categoryId } = useParams();
  
  // Use custom hook to manage category translations
  const { 
    translations, 
    loading, 
    fetchCategoryTranslations, 
    handleDelete 
  } = useCategoryTranslations(categoryId);

  // Fetch translations when category ID changes
  useEffect(() => {
    fetchCategoryTranslations();
  }, [categoryId]);

  return (
    <TranslationsGrid 
      translations={translations}
      onDelete={handleDelete}
      isLoading={loading}
    />
  );
};

export default CategoryPage;