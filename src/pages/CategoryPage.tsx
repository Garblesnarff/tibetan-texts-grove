import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/index/Header";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { CategorySidebar } from "@/components/navigation/CategorySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-amber-50 to-orange-100">
        <CategorySidebar />
        <main className="flex-1 px-4 py-8">
          <div className="container mx-auto">
            <Header />
            <TranslationsGrid 
              translations={translations}
              onDelete={handleDelete}
              isLoading={loading}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CategoryPage;