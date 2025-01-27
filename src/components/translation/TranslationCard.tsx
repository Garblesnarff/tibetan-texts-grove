import React from "react";
import CardTitleDisplay from "./card/CardTitleDisplay";
import CardDescription from "./card/CardDescription";
import CardTitleEditForm from "./CardTitleEditForm";
import { TranslationMetadata } from "./TranslationMetadata";
import { AdminControls } from "./AdminControls";
import { useTitleEditor } from "@/hooks/useTitleEditor";
import { useTranslationSave } from "@/hooks/useTranslationSave";

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
  viewCount?: number;
  featured?: boolean;
  updatedAt?: string;
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
  viewCount = 0,
  featured = false,
  updatedAt = new Date().toISOString(),
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
        <>
          <CardTitleDisplay
            englishTitle={editedEnglishTitle || englishTitle}
            tibetanTitle={tibetanTitle}
            originalTibetanFileName={originalTibetanFileName}
            searchQuery={searchQuery}
          />
          <div className="mt-2">
            <TranslationMetadata
              viewCount={viewCount}
              featured={featured}
              updatedAt={updatedAt}
              tags={tags}
            />
          </div>
        </>
      )}

      <div className="mt-4">
        <CardDescription
          description={description}
          isEditing={isEditingDescription}
          editedDescription={editedDescription}
          setEditedDescription={setEditedDescription}
          setIsEditingDescription={setIsEditingDescription}
          handleSaveClick={handleSaveClick}
          searchQuery={searchQuery}
        />
      </div>

      <AdminControls
        translationId={translationId}
        featured={featured}
        tags={tags}
        viewCount={viewCount}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default TranslationCard;