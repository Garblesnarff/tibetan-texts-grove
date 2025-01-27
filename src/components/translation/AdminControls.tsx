import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Star, X, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AdminControlsProps {
  translationId: string;
  featured: boolean;
  tags: string[];
  viewCount: number;
  onUpdate: () => Promise<void>;
}

export const AdminControls = ({ 
  translationId, 
  featured, 
  tags = [], 
  viewCount = 0,
  onUpdate 
}: AdminControlsProps) => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [newTag, setNewTag] = React.useState("");
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [newViewCount, setNewViewCount] = React.useState(viewCount.toString());

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

  const handleUpdateViewCount = async () => {
    try {
      setIsUpdating(true);
      const newCount = parseInt(newViewCount);
      
      if (isNaN(newCount) || newCount < 0) {
        throw new Error("Invalid view count");
      }

      const { error } = await supabase
        .from('translations')
        .update({ view_count: newCount })
        .eq('id', translationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "View count updated successfully",
      });

      await onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update view count",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetViewCount = async () => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('translations')
        .update({ view_count: 0 })
        .eq('id', translationId);

      if (error) throw error;

      setNewViewCount("0");
      toast({
        title: "Success",
        description: "View count reset successfully",
      });

      await onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset view count",
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
            <Tooltip key={tag}>
              <TooltipTrigger asChild>
                <Badge
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
              </TooltipTrigger>
              <TooltipContent>
                Used in {tags.filter(t => t === tag).length} translations
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={newViewCount}
            onChange={(e) => setNewViewCount(e.target.value)}
            className="w-32"
            min="0"
          />
          <Button
            onClick={handleUpdateViewCount}
            disabled={isUpdating || newViewCount === viewCount.toString()}
          >
            Update Views
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" disabled={isUpdating}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset View Count</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reset the view count to 0? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetViewCount}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};