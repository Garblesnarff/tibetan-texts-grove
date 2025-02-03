import React from "react";
import TranslationActions from "../TranslationActions";

interface ViewerActionsProps {
  categories: Array<{ id: string; title: string }>;
  onCategoryChange: (categoryId: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onEditingChange: (isEditing: boolean) => void;
}

export const ViewerActions = ({
  categories,
  onCategoryChange,
  onDelete,
  onEditingChange,
}: ViewerActionsProps) => {
  return (
    <TranslationActions
      categories={categories}
      onCategoryChange={onCategoryChange}
      onDelete={onDelete}
      onEditingChange={onEditingChange}
    />
  );
};