import React from "react";
import { useNavigate } from "react-router-dom";
import { Translation } from "@/types/translation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TranslationCard from "./translation/TranslationCard";
import TranslationActions from "./translation/TranslationActions";
import { ViewerContainer } from "./translation/viewer/ViewerContainer";
import { TranslationMetadata } from "./translation/viewer/TranslationMetadata";
import { useTranslationState } from "./translation/viewer/useTranslationState";

interface TranslationViewerProps {
  translations: Translation[];
  onDelete: (id: string) => Promise<void>;
}

const TranslationViewer = ({ translations, onDelete }: TranslationViewerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<Array<{ id: string; title: string }>>([]);
  
  const {
    currentTranslation,
    isEditing,
    setIsEditing,
    handleUpdate
  } = useTranslationState(translations[0]);

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
      <TranslationActions
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onDelete={() => onDelete(translations[0].id)}
        onEditingChange={setIsEditing}
      />
      <div className="pt-10">
        <TranslationMetadata translation={currentTranslation} />
        <TranslationCard
          code={currentTranslation.title.split(' ')[0]}
          englishTitle={currentTranslation.title}
          tibetanTitle={currentTranslation.tibetan_title}
          originalTibetanFileName={
            currentTranslation.metadata && 
            typeof currentTranslation.metadata === 'object' && 
            'originalTibetanFileName' in currentTranslation.metadata
              ? (currentTranslation.metadata as { originalTibetanFileName?: string }).originalTibetanFileName
              : undefined
          }
          description={currentTranslation.description}
          translationId={translations[0].id}
          onUpdate={handleUpdate}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
        />
      </div>
    </ViewerContainer>
  );
};

export default TranslationViewer;