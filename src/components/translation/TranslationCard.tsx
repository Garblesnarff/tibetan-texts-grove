import React from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DisplayTitle from "./DisplayTitle";
import CardTitleEditForm from "./CardTitleEditForm";
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
  } = useTitleEditor(englishTitle || '', tibetanTitle || '');

  const handleSave = async () => {
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

  const handleCancel = () => {
    resetTitles();
    onEditingChange(false);
  };

  return (
    <div className={`mb-6 relative ${isEditing ? 'bg-gray-50 p-4 rounded-lg border' : ''}`}>
      {isEditing ? (
        <CardTitleEditForm
          title={editedEnglishTitle}
          englishPdfTitle={editedEnglishTitle}
          tibetanPdfTitle={editedTibetanTitle}
          onTitleChange={setEditedEnglishTitle}
          onEnglishPdfTitleChange={setEditedEnglishTitle}
          onTibetanPdfTitleChange={setEditedTibetanTitle}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <DisplayTitle
            englishTitle={editedEnglishTitle || englishTitle}
            tibetanTitle={tibetanTitle}
            originalTibetanFileName={originalTibetanFileName}
          />
        </>
      )}
    </div>
  );
};

export default TranslationCard;