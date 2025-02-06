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
  
  // We now expect only one translation
  const translation = translations[0];
  
  // Add error handling for missing translation
  if (!translation) {
    console.error('No translation provided to TranslationViewer');
    return null;
  }
  
  const {
    currentTranslation,
    currentVersion,
    isEditing,
    setIsEditing,
    handleUpdate,
    handleVersionSelect
  } = useTranslationState(translation);

  // Use the hook for view tracking
  useTranslationViews(translation.id, async (newCount) => {
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
    navigate(`/translation/${translation.id}`);
  };

  const handleCategoryChange = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .update({ category_id: categoryId })
        .eq('id', translation.id);

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

  // Ensure we have a valid title to display
  const displayTitle = currentTranslation?.title || 'Untitled Translation';

  return (
    <ViewerContainer onClick={handleClick}>
      <ViewerActions
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onDelete={() => onDelete(translation.id)}
        onEditingChange={setIsEditing}
      />
      <ViewerContent
        currentTranslation={currentTranslation}
        translationId={translation.id}
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