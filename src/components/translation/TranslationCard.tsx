import React from "react";
import DisplayTitle from "./DisplayTitle";
import CardTitleEditForm from "./CardTitleEditForm";
import { useTitleEditor } from "@/hooks/useTitleEditor";
import { useTranslationSave } from "@/hooks/useTranslationSave";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";

interface TranslationCardProps {
  code: string;
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
  description?: string;
  translationId: string;
  onUpdate?: () => void;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
}

const TranslationCard = ({ 
  code, 
  englishTitle, 
  tibetanTitle, 
  originalTibetanFileName,
  description,
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
        <DisplayTitle
          englishTitle={editedEnglishTitle || englishTitle}
          tibetanTitle={tibetanTitle}
          originalTibetanFileName={originalTibetanFileName}
        />
      )}

      <div className="mt-4">
        {isEditingDescription ? (
          <div className="space-y-2">
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Enter description..."
              className="min-h-[100px]"
            />
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleSaveClick}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditedDescription(description || '');
                  setIsEditingDescription(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative group">
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No description available</p>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditingDescription(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationCard;