import React from "react";
import CardTitleEditForm from "../CardTitleEditForm";

export interface CardEditModeProps {
  editedEnglishTitle: string;
  editedTibetanTitle: string;
  editedDescription: string;
  setEditedEnglishTitle: (value: string) => void;
  setEditedTibetanTitle: (value: string) => void;
  handleSaveClick: () => void;
  handleCancel: () => void;
  isUpdating?: boolean;
}

export const CardEditMode = ({
  editedEnglishTitle,
  editedTibetanTitle,
  editedDescription,
  setEditedEnglishTitle,
  setEditedTibetanTitle,
  handleSaveClick,
  handleCancel,
  isUpdating = false,
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