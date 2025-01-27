import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AdminControlsProps {
  translationId: string;
  featured: boolean;
  tags: string[];
  onUpdate: () => Promise<void>;
}

export const AdminControls = ({ 
  translationId, 
  featured, 
  tags = [], 
  onUpdate 
}: AdminControlsProps) => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [newTag, setNewTag] = React.useState("");
  const [isUpdating, setIsUpdating] = React.useState(false);

  if (!isAdmin) return null;

  const handleToggleFeatured = async () => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('translations')
        .update({ featured: !featured })
        .eq('id', translationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Translation ${featured ? 'unfeatured' : 'featured'} successfully`,
      });

      await onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update featured status",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleRemoveTag = async (tagToRemove: string) => {
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

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-2">
        <Button
          variant={featured ? "default" : "outline"}
          size="sm"
          onClick={handleToggleFeatured}
          disabled={isUpdating}
          className="flex items-center gap-2"
        >
          <Star className={`h-4 w-4 ${featured ? 'fill-current' : ''}`} />
          {featured ? 'Featured' : 'Mark as Featured'}
        </Button>
      </div>

      <div className="space-y-2">
        <form onSubmit={handleAddTag} className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            className="flex-1"
          />
          <Button type="submit" disabled={isUpdating || !newTag.trim()}>
            Add Tag
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-destructive"
                disabled={isUpdating}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};