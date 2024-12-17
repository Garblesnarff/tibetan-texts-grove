import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EditableTitle from "./EditableTitle";
import DisplayTitle from "./DisplayTitle";
import TitleEditControls from "./TitleEditControls";

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
 * Main component for managing translation titles display and editing
 * Coordinates between edit controls and title display/edit components
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.code - The translation code identifier
 * @param {string} [props.englishTitle] - The English title of the translation
 * @param {string} [props.tibetanTitle] - The Tibetan title of the translation
 * @param {string} [props.originalTibetanFileName] - Original filename for the Tibetan text
 * @param {string} props.translationId - Unique identifier for the translation
 * @param {Function} [props.onUpdate] - Callback function triggered after successful update
 * @param {boolean} props.isEditing - Controls whether the component is in edit mode
 * @param {Function} props.onEditingChange - Callback to update the editing state
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
  // State for managing edited title values
  const [editedEnglishTitle, setEditedEnglishTitle] = useState(englishTitle || "");
  const [editedTibetanTitle, setEditedTibetanTitle] = useState(tibetanTitle || "");
  const { toast } = useToast();

  /**
   * Handles saving the edited translation titles to the database
   * Updates both English and Tibetan titles simultaneously
   * Shows success/error toast messages based on the operation result
   * 
   * @async
   * @function handleSave
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
      if (onUpdate) onUpdate();
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
   * Resets the edited titles to their original values
   * 
   * @function handleCancel
   */
  const handleCancel = () => {
    setEditedEnglishTitle(englishTitle || "");
    setEditedTibetanTitle(tibetanTitle || "");
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