import React from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DisplayTitle from "./DisplayTitle";
import TitleEditForm from "./TitleEditForm";
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
  
  // Remove the code prefix for editing
  const fullTitleWithoutCode = englishTitle?.replace(`${code} `, '') || '';
  
  const {
    editedEnglishTitle,
    editedTibetanTitle,
    setEditedEnglishTitle,
    setEditedTibetanTitle,
    resetTitles
  } = useTitleEditor(fullTitleWithoutCode, tibetanTitle);

  const handleSave = async () => {
    try {
      console.log('Saving with values:', {
        code,
        editedEnglishTitle,
        editedTibetanTitle,
        translationId
      });

      // Add the code prefix back when saving
      const completeTitle = `${code} ${editedEnglishTitle}`;
      
      const { data, error } = await supabase
        .from('translations')
        .update({
          title: completeTitle,
          tibetan_title: editedTibetanTitle || null
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
            englishTitle={fullTitleWithoutCode}
            tibetanTitle={tibetanTitle}
            originalTibetanFileName={originalTibetanFileName}
          />
        </>
      )}
    </div>
  );
};

export default TranslationCard;