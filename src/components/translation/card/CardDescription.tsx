import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, X, Loader2 } from "lucide-react";
import { highlightText } from "@/utils/highlightText";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CardDescriptionProps {
  translationId: string;
  description?: string;
  isEditing: boolean;
  editedDescription: string;
  setEditedDescription: (value: string) => void;
  setIsEditingDescription: (value: boolean) => void;
  searchQuery?: string;
  onUpdate?: () => Promise<void>;
}

const CardDescription = ({
  translationId,
  description,
  isEditing,
  editedDescription,
  setEditedDescription,
  setIsEditingDescription,
  searchQuery,
  onUpdate
}: CardDescriptionProps) => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('translations')
        .update({ description: editedDescription })
        .eq('id', translationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Description updated successfully",
      });
      
      onUpdate?.();
      setIsEditingDescription(false);
    } catch (error: any) {
      console.error('Error updating description:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update description",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="Enter description..."
          className="min-h-[100px] resize-none"
          disabled={isSaving}
        />
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditedDescription(description || '');
              setIsEditingDescription(false);
            }}
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-2" />
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
      {isAdmin && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-[#F97316] hover:bg-[#F97316]/80"
          onClick={() => setIsEditingDescription(true)}
        >
          <Pencil className="h-4 w-4 text-white" />
        </Button>
      )}
    </div>
  );
};

export default CardDescription;