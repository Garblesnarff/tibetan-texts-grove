import React from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DisplayTitle from "./DisplayTitle";
import TitleEditForm from "./TitleEditForm";
import { useTitleEditor } from "@/hooks/useTitleEditor";

interface TranslationCardProps {
  /** Translation code identifier */
  code: string;
  /** English title of the translation */
  englishTitle?: string;
  /** Tibetan title of the translation */
  tibetanTitle?: string;
  /** Original Tibetan filename */
  originalTibetanFileName?: string;
  /** Unique identifier for the translation */
  translationId: string;
  /** Callback triggered after successful update */
  onUpdate?: () => void;
  /** Controls edit mode state */
  isEditing: boolean;
  /** Callback to update edit mode state */
  onEditingChange: (isEditing: boolean) => void;
}

/**
 * TranslationCard Component
 * Displays and manages translation titles in both view and edit modes
 * 
 * @component
 * @param {TranslationCardProps} props - Component properties
 */
const TranslationCard = ({ 
  code, 
  englishTitle, 
  tibetanTitle, 
  originalTibetanFileName,
  translationId,
  onUpdate,
  isEditing,
  onEditingChange
}: TranslationCardProps) => {
  const { toast } = useToast();
  
  // Extract the full English title by removing the code prefix for editing
  const fullEnglishTitle = englishTitle?.split(' ').slice(1).join(' ') || '';
  
  // Initialize title editor hook for managing edit state
  const {
    editedEnglishTitle,
    editedTibetanTitle,
    setEditedEnglishTitle,
    setEditedTibetanTitle,
    resetTitles
  } = useTitleEditor(fullEnglishTitle, tibetanTitle);

  /**
   * Handles saving the edited translation titles
   * Updates both English and Tibetan titles in the database
   * Refreshes the page or calls onUpdate callback after successful save
   */
  const handleSave = async () => {
    try {
      // When saving, we need to include the code prefix in the title
      const completeTitle = `${code} ${editedEnglishTitle}`;
      
      const { error } = await supabase
        .from('translations')
        .update({
          title: completeTitle,
          tibetan_title: editedTibetanTitle || null
        })
        .eq('id', translationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation titles updated successfully",
      });
      
      onEditingChange(false);
      
      if (onUpdate) {
        onUpdate();
      } else {
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating translation",
        description: error.message
      });
    }
  };

  /**
   * Handles canceling the edit operation
   * Resets titles to their original values
   */
  const handleCancel = () => {
    resetTitles();
    onEditingChange(false);
  };

  return (
    <div className={`mb-6 relative ${isEditing ? 'bg-gray-50 p-4 rounded-lg border' : ''}`}>
      {isEditing ? (
        <TitleEditForm
          code={code}
          editedEnglishTitle={editedEnglishTitle}
          editedTibetanTitle={editedTibetanTitle}
          onEnglishTitleChange={setEditedEnglishTitle}
          onTibetanTitleChange={setEditedTibetanTitle}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">{code}</h3>
          <DisplayTitle
            englishTitle={fullEnglishTitle}
            tibetanTitle={tibetanTitle}
            originalTibetanFileName={originalTibetanFileName}
          />
        </>
      )}
    </div>
  );
};

export default TranslationCard;