import React from "react";
import { useNavigate } from "react-router-dom";
import { Translation } from "@/types/translation";
import { supabase } from "@/integrations/supabase/client";
import { ViewerContainer } from "./viewer/ViewerContainer";
import { ViewerActions } from "./viewer/ViewerActions";
import { ViewerContent } from "./viewer/ViewerContent";
import { ViewerHeader } from "./viewer/ViewerHeader";
import { useTranslationState } from "./viewer/useTranslationState";
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
  const [categories, setCategories] = React.useState<Array<{ id: string; title: string }>>([]);
  
  // We expect only one translation
  const translation = translations[0];
  
  const {
    currentTranslation,
    currentVersion,
    isEditing,
    setIsEditing,
    handleUpdate,
    handleVersionSelect
  } = useTranslationState(translation);

  // Use the hook for view tracking
  useTranslationViews(translation.id, async () => {
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

  return (
    <ViewerContainer onClick={handleClick}>
      <ViewerHeader translation={currentTranslation} />
      <ViewerActions
        categories={categories}
        onCategoryChange={async (categoryId) => {
          try {
            const { error } = await supabase
              .from('translations')
              .update({ category_id: categoryId })
              .eq('id', translation.id);

            if (error) throw error;
            await handleUpdate();
          } catch (error) {
            console.error('Error updating category:', error);
          }
        }}
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