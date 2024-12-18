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

/**
 * CardTitleEditForm Component
 * Form for editing translation titles
 * Handles both the main card title and PDF titles
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.title - Main card title
 * @param {string} props.englishPdfTitle - English PDF title
 * @param {string} props.tibetanPdfTitle - Tibetan PDF title
 * @param {Function} props.onTitleChange - Handler for main title changes
 * @param {Function} props.onEnglishPdfTitleChange - Handler for English PDF title changes
 * @param {Function} props.onTibetanPdfTitleChange - Handler for Tibetan PDF title changes
 * @param {Function} props.onSave - Handler for save action
 * @param {Function} props.onCancel - Handler for cancel action
 */
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