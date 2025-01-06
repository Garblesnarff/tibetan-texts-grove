import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseTranslationSaveProps {
  translationId: string;
  onUpdate?: () => void;
  onEditingChange: (isEditing: boolean) => void;
}

export const useTranslationSave = ({
  translationId,
  onUpdate,
  onEditingChange,
}: UseTranslationSaveProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (
    englishTitle: string,
    tibetanTitle: string,
    description?: string
  ) => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('translations')
        .update({
          title: englishTitle,
          tibetan_title: tibetanTitle,
          description: description,
        })
        .eq('id', translationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation updated successfully",
      });

      onUpdate?.();
      onEditingChange(false);
    } catch (error: any) {
      console.error('Error saving translation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update translation",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleSave,
    isSaving,
  };
};