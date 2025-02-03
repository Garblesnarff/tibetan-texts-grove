import React from "react";
import { useNavigate } from "react-router-dom";
import { Translation } from "@/types/translation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ViewerContainer } from "./translation/viewer/ViewerContainer";
import { ViewerActions } from "./translation/viewer/ViewerActions";
import { ViewerContent } from "./translation/viewer/ViewerContent";
import { useTranslationState } from "./translation/viewer/useTranslationState";
import { useTranslationViews } from "@/hooks/useTranslationViews";

interface TranslationViewerProps {
  translations: Translation[];
  onDelete: (id: string) => Promise<void>;
  searchQuery?: string;
  showRelevance?: boolean;
}

const TranslationViewer = ({ 
  translations, 
  onDelete, 
  searchQuery,
  showRelevance = false 
}: TranslationViewerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<Array<{ id: string; title: string }>>([]);
  
  const {
    currentTranslation,
    currentVersion,
    isEditing,
    setIsEditing,
    handleUpdate,
    handleVersionSelect
  } = useTranslationState(translations[0]);

  // Use the hook for view tracking
  useTranslationViews(translations[0].id, async (newCount) => {
    await handleUpdate();
  });

  React.useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, title')
        .order('title');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.delete-button, .edit-button, .category-button, [role="menuitem"], textarea, button')) {
      e.stopPropagation();
      return;
    }
    if (translations.length > 0) {
      navigate(`/translation/${translations[0].id}`);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .update({ category_id: categoryId })
        .eq('id', translations[0].id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation moved to new category",
      });

      await handleUpdate();
    } catch (error: any) {
      console.error('Error in handleCategoryChange:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to move translation to new category",
      });
    }
  };

  return (
    <ViewerContainer onClick={handleClick}>
      <ViewerActions
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onDelete={() => onDelete(translations[0].id)}
        onEditingChange={setIsEditing}
      />
      <ViewerContent
        currentTranslation={currentTranslation}
        translationId={translations[0].id}
        isEditing={isEditing}
        onEditingChange={setIsEditing}
        searchQuery={searchQuery}
        onUpdate={handleUpdate}
        currentVersion={currentVersion}
        onVersionSelect={handleVersionSelect}
      />
    </ViewerContainer>
  );
};

export default TranslationViewer;