import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
 * Displays and manages the editing of translation titles in both English and Tibetan.
 * Provides inline editing capabilities with save and cancel functionality.
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
        <div className="absolute top-0 right-0 space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="h-8 w-8"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2">{code}</h3>
      
      {isEditing ? (
        <div className="space-y-4">
          <Input
            value={editedEnglishTitle}
            onChange={(e) => setEditedEnglishTitle(e.target.value)}
            placeholder="English Title"
            className="w-full"
          />
          <Input
            value={editedTibetanTitle}
            onChange={(e) => setEditedTibetanTitle(e.target.value)}
            placeholder="Tibetan Title"
            className="w-full font-tibetan"
          />
        </div>
      ) : (
        <>
          {englishTitle && (
            <p className="text-gray-700 mb-2">
              {englishTitle}
            </p>
          )}
          {(originalTibetanFileName || tibetanTitle) && (
            <p className="text-tibetan-maroon font-tibetan text-xl">
              {originalTibetanFileName || tibetanTitle}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default TranslationCard;