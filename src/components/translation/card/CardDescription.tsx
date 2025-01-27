import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save } from "lucide-react";
import { highlightText } from "@/utils/highlightText";

interface CardDescriptionProps {
  description?: string;
  isEditing: boolean;
  editedDescription: string;
  setEditedDescription: (value: string) => void;
  setIsEditingDescription: (value: boolean) => void;
  handleSaveClick: () => void;
  searchQuery?: string;
}

const CardDescription = ({
  description,
  isEditing,
  editedDescription,
  setEditedDescription,
  setIsEditingDescription,
  handleSaveClick,
  searchQuery
}: CardDescriptionProps) => {
  if (isEditing) {
    return (
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
    );
  }

  return (
    <div className="relative group">
      {description ? (
        <p className="text-sm text-muted-foreground">
          {searchQuery ? highlightText(description, searchQuery) : description}
        </p>
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
  );
};

export default CardDescription;