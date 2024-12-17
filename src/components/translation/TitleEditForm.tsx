import React from "react";
import EditableTitle from "./EditableTitle";
import TitleEditControls from "./TitleEditControls";

interface TitleEditFormProps {
  code: string;
  editedEnglishTitle: string;
  editedTibetanTitle: string;
  onEnglishTitleChange: (value: string) => void;
  onTibetanTitleChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * TitleEditForm Component
 * Renders the form for editing translation titles
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.code - Translation code identifier
 * @param {string} props.editedEnglishTitle - Current English title being edited
 * @param {string} props.editedTibetanTitle - Current Tibetan title being edited
 * @param {Function} props.onEnglishTitleChange - Handler for English title changes
 * @param {Function} props.onTibetanTitleChange - Handler for Tibetan title changes
 * @param {Function} props.onSave - Handler for save action
 * @param {Function} props.onCancel - Handler for cancel action
 */
const TitleEditForm = ({
  code,
  editedEnglishTitle,
  editedTibetanTitle,
  onEnglishTitleChange,
  onTibetanTitleChange,
  onSave,
  onCancel
}: TitleEditFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-2">{code}</h3>
      <EditableTitle
        value={editedEnglishTitle}
        onChange={onEnglishTitleChange}
        placeholder="English Title"
        className="w-full"
      />
      <EditableTitle
        value={editedTibetanTitle}
        onChange={onTibetanTitleChange}
        placeholder="Tibetan Title"
        className="w-full font-tibetan"
      />
      <TitleEditControls
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
};

export default TitleEditForm;