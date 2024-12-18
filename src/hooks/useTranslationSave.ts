import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseTranslationSaveProps {
  translationId: string;
  onUpdate?: () => void;
  onEditingChange: (isEditing: boolean) => void;
}

/**
 * Custom hook for handling translation save operations
 * Manages the save operation to Supabase and related UI feedback
 * 
 * @param {Object} props - Hook configuration
 * @param {string} props.translationId - ID of the translation being edited
 * @param {Function} [props.onUpdate] - Optional callback after successful update
 * @param {Function} props.onEditingChange - Callback to update editing state
 * @returns {Object} Save handler and related utilities
 */
export const useTranslationSave = ({ 
  translationId, 
  onUpdate, 
  onEditingChange 
}: UseTranslationSaveProps) => {
  const { toast } = useToast();

  /**
   * Handles saving the translation to Supabase
   * Updates both the title and metadata fields
   * 
   * @param {string} editedEnglishTitle - New English title
   * @param {string} editedTibetanTitle - New Tibetan title
   */
  const handleSave = async (editedEnglishTitle: string, editedTibetanTitle: string) => {
    try {
      console.log('Saving with values:', {
        editedEnglishTitle,
        editedTibetanTitle,
        translationId
      });
      
      const { data, error } = await supabase
        .from('translations')
        .update({
          title: editedEnglishTitle,
          tibetan_title: editedTibetanTitle || null,
          metadata: {
            originalFileName: editedEnglishTitle,
            originalTibetanFileName: editedTibetanTitle || null
          }
        })
        .eq('id', translationId)
        .select();

      if (error) {
        console.error('Error updating translation:', error);
        throw error;
      }

      console.log('Update response:', data);

      toast({
        title: "Success",
        description: "Translation titles updated successfully",
      });
      
      onEditingChange(false);
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error('Error updating translation:', error);
      toast({
        variant: "destructive",
        title: "Error updating translation",
        description: error.message
      });
    }
  };

  return { handleSave };
};