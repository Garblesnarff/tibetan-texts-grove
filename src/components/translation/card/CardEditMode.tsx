import React from "react";
import CardTitleEditForm from "../CardTitleEditForm";

interface CardEditModeProps {
  editedEnglishTitle: string;
  editedTibetanTitle: string;
  editedDescription: string;
  setEditedEnglishTitle: (value: string) => void;
  setEditedTibetanTitle: (value: string) => void;
  handleSaveClick: () => void;
  handleCancel: () => void;
}

export const CardEditMode = ({
  editedEnglishTitle,
  editedTibetanTitle,
  editedDescription,
  setEditedEnglishTitle,
  setEditedTibetanTitle,
  handleSaveClick,
  handleCancel,
}: CardEditModeProps) => {
  return (
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
  );
};