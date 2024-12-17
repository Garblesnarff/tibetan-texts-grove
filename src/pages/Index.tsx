import { useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { Header } from "@/components/index/Header";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";

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
    <div className="container mx-auto px-4 py-8">
      <Header />
      <TranslationsGrid 
        translations={translations}
        onDelete={handleDelete}
        isLoading={loading}
      />
    </div>
  );
}