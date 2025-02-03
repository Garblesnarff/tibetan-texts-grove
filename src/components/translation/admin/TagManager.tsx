import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TagManagerProps {
  translationId: string;
  tags: string[];
  onUpdate: () => Promise<void>;
}

export const TagManager = ({ translationId, tags = [], onUpdate }: TagManagerProps) => {
  const { toast } = useToast();
  const [newTag, setNewTag] = React.useState("");
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newTag.trim()) return;

    try {
      setIsUpdating(true);
      const updatedTags = [...new Set([...tags, newTag.trim()])];
      
      const { error } = await supabase
        .from('translations')
        .update({ tags: updatedTags })
        .eq('id', translationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tag added successfully",
      });

      setNewTag("");
      await onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add tag",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveTag = async (e: React.MouseEvent, tagToRemove: string) => {
    e.stopPropagation();
    try {
      setIsUpdating(true);
      const updatedTags = tags.filter(tag => tag !== tagToRemove);
      
      const { error } = await supabase
        .from('translations')
        .update({ tags: updatedTags })
        .eq('id', translationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tag removed successfully",
      });

      await onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove tag",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleAddTag} className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onClick={handleInputClick}
          placeholder="Add a tag..."
          className="flex-1"
        />
        <Button type="submit" disabled={isUpdating || !newTag.trim()}>
          Add Tag
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tooltip key={tag}>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={(e) => handleRemoveTag(e, tag)}
                  className="ml-1 hover:text-destructive"
                  disabled={isUpdating}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Used in {tags.filter(t => t === tag).length} translations
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};