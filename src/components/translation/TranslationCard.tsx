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

/**
 * TranslationCard Component
 * Displays and manages the editing of translation titles
 * Handles both display and edit modes for translation metadata
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.code - Translation code identifier
 * @param {string} [props.englishTitle] - English title of the translation
 * @param {string} [props.tibetanTitle] - Tibetan title of the translation
 * @param {string} [props.originalTibetanFileName] - Original Tibetan filename
 * @param {string} props.translationId - Unique identifier for the translation
 * @param {Function} [props.onUpdate] - Callback after successful update
 * @param {boolean} props.isEditing - Whether the card is in edit mode
 * @param {Function} props.onEditingChange - Handler for edit mode changes
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
    <div className={`mb-6 relative ${isEditing ? 'bg-gray-50 p-4 rounded-lg border' : ''}`}>
      {isEditing ? (
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