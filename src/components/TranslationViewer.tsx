import React, { useState } from "react";
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
  onUpdate?: (updatedTranslation: Translation) => Promise<void>;
}

const TranslationViewer = ({ 
  translations, 
  onDelete, 
  searchQuery,
  showRelevance = false,
  onUpdate
}: TranslationViewerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [categories, setCategories] = React.useState<Array<{ id: string; title: string }>>([]);
  
  // We now expect only one translation
  const translation = translations[0];
  
  const {
    currentTranslation,
    currentVersion,
    isEditing,
    setIsEditing,
    handleUpdate: handleStateUpdate,
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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch categories",
        });
        return;
      }
      
      setCategories(data || []);
    };

    fetchCategories();
  }, [toast]);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await handleStateUpdate();
      
      if (onUpdate) {
        await onUpdate(currentTranslation);
      }

      toast({
        title: "Success",
        description: "Translation updated successfully",
      });
    } catch (error) {
      console.error('Error updating translation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update translation",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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
      setIsUpdating(true);
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
    } finally {
      setIsUpdating(false);
    }
  };

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
        isUpdating={isUpdating}
      />
    </ViewerContainer>
  );
};

export default TranslationViewer;