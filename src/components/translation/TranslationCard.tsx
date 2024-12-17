import React from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EditableTitle from "./EditableTitle";
import DisplayTitle from "./DisplayTitle";
import TitleEditControls from "./TitleEditControls";
import { useTitleEditor } from "@/hooks/useTitleEditor";

interface TranslationCardProps {
  code: string;
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
  translationId: string;
  onUpdate?: () => void;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
}

/**
 * TranslationCard Component
 * Displays and manages translation titles in both view and edit modes
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.code - Translation code identifier
 * @param {string} [props.englishTitle] - English title of the translation
 * @param {string} [props.tibetanTitle] - Tibetan title of the translation
 * @param {string} [props.originalTibetanFileName] - Original Tibetan filename
 * @param {string} props.translationId - Unique identifier for the translation
 * @param {Function} [props.onUpdate] - Callback triggered after successful update
 * @param {boolean} props.isEditing - Controls edit mode state
 * @param {Function} props.onEditingChange - Callback to update edit mode state
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
  const {
    editedEnglishTitle,
    editedTibetanTitle,
    setEditedEnglishTitle,
    setEditedTibetanTitle,
    resetTitles
  } = useTitleEditor(englishTitle, tibetanTitle);

  /**
   * Handles saving the edited translation titles
   * Updates both English and Tibetan titles in the database
   * and refreshes the page to show updated content
   */
  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('translations')
        .update({
          title: editedEnglishTitle,
          tibetan_title: editedTibetanTitle || null
        })
        .eq('id', translationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation titles updated successfully",
      });
      
      onEditingChange(false);
      
      // Ensure the page refreshes to show updated content
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
    <div className="mb-6 relative">
      {isEditing && (
        <TitleEditControls
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <h3 className="text-xl font-semibold mb-2">{code}</h3>
      
      {isEditing ? (
        <div className="space-y-4">
          <EditableTitle
            value={editedEnglishTitle}
            onChange={setEditedEnglishTitle}
            placeholder="English Title"
            className="w-full"
          />
          <EditableTitle
            value={editedTibetanTitle}
            onChange={setEditedTibetanTitle}
            placeholder="Tibetan Title"
            className="w-full font-tibetan"
          />
        </div>
      ) : (
        <DisplayTitle
          englishTitle={englishTitle}
          tibetanTitle={tibetanTitle}
          originalTibetanFileName={originalTibetanFileName}
        />
      )}
    </div>
  );
};

export default TranslationCard;