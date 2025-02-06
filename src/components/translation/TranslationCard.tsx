import React, { useState } from "react";
import { useTitleEditor } from "@/hooks/useTitleEditor";
import { useTranslationSave } from "@/hooks/useTranslationSave";
import { AdminControls } from "./AdminControls";
import { CardEditMode } from "./card/CardEditMode";
import { CardViewMode } from "./card/CardViewMode";
import CardDescription from "./card/CardDescription";
import { useToast } from "@/hooks/use-toast";

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
  isUpdating?: boolean;
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
  isUpdating = false,
}: TranslationCardProps) => {
  const { toast } = useToast();
  const [optimisticData, setOptimisticData] = useState({
    englishTitle,
    tibetanTitle,
    description,
    tags
  });

  const {
    editedEnglishTitle,
    editedTibetanTitle,
    setEditedEnglishTitle,
    setEditedTibetanTitle,
    resetTitles
  } = useTitleEditor(optimisticData.englishTitle || '', optimisticData.tibetanTitle || '');

  const [editedDescription, setEditedDescription] = React.useState(optimisticData.description || '');
  const [isEditingDescription, setIsEditingDescription] = React.useState(false);

  const { handleSave } = useTranslationSave({
    translationId,
    onUpdate,
    onEditingChange
  });

  const handleSaveClick = async () => {
    try {
      // Optimistic update
      setOptimisticData({
        englishTitle: editedEnglishTitle,
        tibetanTitle: editedTibetanTitle,
        description: editedDescription,
        tags
      });

      await handleSave(editedEnglishTitle, editedTibetanTitle, editedDescription);
      setIsEditingDescription(false);
      
      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      // Revert optimistic update
      setOptimisticData({
        englishTitle,
        tibetanTitle,
        description,
        tags
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes",
      });
    }
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
          isUpdating={isUpdating}
        />
      ) : (
        <CardViewMode
          englishTitle={optimisticData.englishTitle || englishTitle}
          tibetanTitle={tibetanTitle}
          originalTibetanFileName={originalTibetanFileName}
          searchQuery={searchQuery}
          view_count={view_count}
          featured={featured}
          updated_at={updated_at}
          created_at={created_at}
          tags={tags}
          isUpdating={isUpdating}
        />
      )}

      <div className="mt-4">
        <CardDescription
          translationId={translationId}
          description={optimisticData.description || description}
          isEditing={isEditingDescription}
          editedDescription={editedDescription}
          setEditedDescription={setEditedDescription}
          setIsEditingDescription={setIsEditingDescription}
          searchQuery={searchQuery}
          onUpdate={onUpdate}
          isUpdating={isUpdating}
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