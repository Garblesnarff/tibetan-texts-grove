import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Translation } from "@/types/translation";
import { supabase } from "@/integrations/supabase/client";
import TranslationCard from "./translation/TranslationCard";
import TranslationActions from "./translation/TranslationActions";
import { useToast } from "@/hooks/use-toast";

interface TranslationViewerProps {
  translations: Translation[];
  onDelete: (id: string) => Promise<void>;
}

/**
 * Type guard to check if metadata contains originalTibetanFileName
 */
const hasOriginalTibetanFileName = (metadata: Translation['metadata']): metadata is { originalTibetanFileName?: string } & Record<string, unknown> => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return false;
  return 'originalTibetanFileName' in metadata;
};

/**
 * TranslationViewer Component
 * Displays a single translation card with editing capabilities and category management
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Translation[]} props.translations - Array of translations (currently only uses first item)
 * @param {Function} props.onDelete - Callback function for translation deletion
 */
const TranslationViewer = ({ translations, onDelete }: TranslationViewerProps) => {
  const navigate = useNavigate();
  const code = translations[0]?.title.split(' ')[0];
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentTranslation, setCurrentTranslation] = React.useState(translations[0]);
  const [categories, setCategories] = React.useState<Array<{ id: string; title: string }>>([]);
  const { toast } = useToast();

  /**
   * Fetches available categories from the database
   */
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

  /**
   * Handles click events on the card
   * Navigates to translation detail page unless clicking action buttons
   */
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.delete-button, .edit-button, .category-button, [role="menuitem"]')) {
      e.stopPropagation();
      return;
    }
    if (translations.length > 0) {
      navigate(`/translation/${translations[0].id}`);
    }
  };

  /**
   * Updates the current translation data
   */
  const handleUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('id', translations[0].id)
        .single();
        
      if (error) {
        console.error('Error fetching updated translation:', error);
        return;
      }
      
      if (data) {
        console.log('Updated translation data:', data);
        setCurrentTranslation(data);
      }
    } catch (err) {
      console.error('Error in handleUpdate:', err);
    }
  };

  /**
   * Handles category changes for the translation
   */
  const handleCategoryChange = async (categoryId: string) => {
    try {
      console.log('Updating category for translation:', translations[0].id, 'to category:', categoryId);
      
      const { error } = await supabase
        .from('translations')
        .update({ category_id: categoryId })
        .eq('id', translations[0].id);

      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }

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

  const englishTranslation = currentTranslation;
  const tibetanTranslation = currentTranslation;
  const originalTibetanTitle = hasOriginalTibetanFileName(tibetanTranslation?.metadata) 
    ? tibetanTranslation.metadata.originalTibetanFileName 
    : undefined;

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow relative min-h-[200px]" 
      onClick={handleClick}
    >
      <TranslationActions
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onDelete={() => onDelete(translations[0].id)}
        onEditingChange={setIsEditing}
      />
      <div className="pt-10">
        <TranslationCard
          code={code}
          englishTitle={englishTranslation?.title}
          tibetanTitle={tibetanTranslation?.tibetan_title}
          originalTibetanFileName={originalTibetanTitle}
          translationId={translations[0].id}
          onUpdate={handleUpdate}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
        />
      </div>
    </Card>
  );
};

export default TranslationViewer;