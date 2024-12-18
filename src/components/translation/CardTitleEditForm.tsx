import React from "react";
import EditableTitle from "./EditableTitle";
import TitleEditControls from "./TitleEditControls";

interface CardTitleEditFormProps {
  title: string;
  englishPdfTitle: string;
  tibetanPdfTitle: string;
  onTitleChange: (value: string) => void;
  onEnglishPdfTitleChange: (value: string) => void;
  onTibetanPdfTitleChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CardTitleEditForm = ({
  title,
  englishPdfTitle,
  tibetanPdfTitle,
  onTitleChange,
  onEnglishPdfTitleChange,
  onTibetanPdfTitleChange,
  onSave,
  onCancel
}: CardTitleEditFormProps) => {
  return (
    <div className="space-y-4">
      <EditableTitle
        value={title}
        onChange={onTitleChange}
        placeholder="Card Title"
        className="w-full font-semibold text-xl"
      />
      <EditableTitle
        value={englishPdfTitle}
        onChange={onEnglishPdfTitleChange}
        placeholder="English PDF Title"
        className="w-full"
      />
      <EditableTitle
        value={tibetanPdfTitle}
        onChange={onTibetanPdfTitleChange}
        placeholder="Tibetan PDF Title"
        className="w-full font-tibetan"
      />
      <TitleEditControls
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
};

export default CardTitleEditForm;