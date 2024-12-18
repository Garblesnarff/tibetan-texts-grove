import { useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Header } from "@/components/index/Header";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { CategorySidebar } from "@/components/navigation/CategorySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

/**
 * Index Page Component
 * Main page displaying all translations grouped by their codes
 * Includes functionality for viewing, managing, and deleting translations
 */
export default function Index() {
  const { translations, loading, fetchTranslations, handleDelete } = useTranslations();

  // Fetch translations on component mount
  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

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
}