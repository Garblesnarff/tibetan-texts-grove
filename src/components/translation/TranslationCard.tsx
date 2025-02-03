import React from "react";
import { useTitleEditor } from "@/hooks/useTitleEditor";
import { useTranslationSave } from "@/hooks/useTranslationSave";
import { AdminControls } from "./AdminControls";
import { CardEditMode } from "./card/CardEditMode";
import { CardViewMode } from "./card/CardViewMode";
import CardDescription from "./card/CardDescription";

interface TranslationCardProps {
  code: string;
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
  description?: string;
  translationId: string;
  onUpdate?: () => Promise<void>;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  searchQuery?: string;
  view_count?: number;
  featured?: boolean;
  updated_at?: string;
  created_at?: string;
  tags?: string[];
}

const TranslationCard = ({
  code,
  englishTitle,
  tibetanTitle,
  originalTibetanFileName,
  description,
  translationId,
  onUpdate = async () => {},
  isEditing,
  onEditingChange,
  searchQuery,
  view_count = 0,
  featured = false,
  updated_at = new Date().toISOString(),
  created_at = new Date().toISOString(),
  tags = [],
}: TranslationCardProps) => {
  const {
    editedEnglishTitle,
    editedTibetanTitle,
    setEditedEnglishTitle,
    setEditedTibetanTitle,
    resetTitles
  } = useTitleEditor(englishTitle || '', tibetanTitle || '');

  const [editedDescription, setEditedDescription] = React.useState(description || '');
  const [isEditingDescription, setIsEditingDescription] = React.useState(false);

  const { handleSave } = useTranslationSave({
    translationId,
    onUpdate,
    onEditingChange
  });

  const handleSaveClick = async () => {
    await handleSave(editedEnglishTitle, editedTibetanTitle, editedDescription);
    setIsEditingDescription(false);
  };

  const handleCancel = () => {
    resetTitles();
    setEditedDescription(description || '');
    setIsEditingDescription(false);
    onEditingChange(false);
  };

  return (
    <div className={`mb-6 relative ${isEditing ? 'bg-background p-4 rounded-lg border shadow-sm' : ''}`}>
      {isEditing ? (
        <CardEditMode
          editedEnglishTitle={editedEnglishTitle}
          editedTibetanTitle={editedTibetanTitle}
          editedDescription={editedDescription}
          setEditedEnglishTitle={setEditedEnglishTitle}
          setEditedTibetanTitle={setEditedTibetanTitle}
          handleSaveClick={handleSaveClick}
          handleCancel={handleCancel}
        />
      ) : (
        <CardViewMode
          englishTitle={editedEnglishTitle || englishTitle}
          tibetanTitle={tibetanTitle}
          originalTibetanFileName={originalTibetanFileName}
          searchQuery={searchQuery}
          view_count={view_count}
          featured={featured}
          updated_at={updated_at}
          created_at={created_at}
          tags={tags}
        />
      )}

      <div className="mt-4">
        <CardDescription
          translationId={translationId}
          description={description}
          isEditing={isEditingDescription}
          editedDescription={editedDescription}
          setEditedDescription={setEditedDescription}
          setIsEditingDescription={setIsEditingDescription}
          searchQuery={searchQuery}
          onUpdate={onUpdate}
        />
      </div>

      <AdminControls
        translationId={translationId}
        featured={featured}
        tags={tags}
        viewCount={view_count}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default TranslationCard;