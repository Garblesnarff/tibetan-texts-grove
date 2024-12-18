import React from "react";
import DisplayTitle from "./DisplayTitle";
import CardTitleEditForm from "./CardTitleEditForm";
import { useTitleEditor } from "@/hooks/useTitleEditor";
import { useTranslationSave } from "@/hooks/useTranslationSave";

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
  const {
    editedEnglishTitle,
    editedTibetanTitle,
    setEditedEnglishTitle,
    setEditedTibetanTitle,
    resetTitles
  } = useTitleEditor(englishTitle || '', tibetanTitle || '');

  const { handleSave } = useTranslationSave({
    translationId,
    onUpdate,
    onEditingChange
  });

  const handleSaveClick = () => {
    handleSave(editedEnglishTitle, editedTibetanTitle);
  };

  const handleCancel = () => {
    resetTitles();
    onEditingChange(false);
  };

  return (
    <div className={`mb-6 relative ${isEditing ? 'bg-background p-4 rounded-lg border shadow-sm' : ''}`}>
      {isEditing ? (
        <div className="relative z-50">
          <CardTitleEditForm
            title={editedEnglishTitle}
            englishPdfTitle={editedEnglishTitle}
            tibetanPdfTitle={editedTibetanTitle}
            onTitleChange={setEditedEnglishTitle}
            onEnglishPdfTitleChange={setEditedEnglishTitle}
            onTibetanPdfTitleChange={setEditedTibetanTitle}
            onSave={handleSaveClick}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <DisplayTitle
          englishTitle={editedEnglishTitle || englishTitle}
          tibetanTitle={tibetanTitle}
          originalTibetanFileName={originalTibetanFileName}
        />
      )}
    </div>
  );
};

export default TranslationCard;