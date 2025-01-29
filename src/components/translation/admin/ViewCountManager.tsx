import React from "react";
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
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ViewCountManagerProps {
  translationId: string;
  viewCount: number;
  onUpdate: () => Promise<void>;
}

export const ViewCountManager = ({ translationId, viewCount, onUpdate }: ViewCountManagerProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [newViewCount, setNewViewCount] = React.useState(viewCount.toString());

  const handleUpdateViewCount = async () => {
    try {
      setIsUpdating(true);
      const newCount = parseInt(newViewCount);
      
      if (isNaN(newCount) || newCount < 0) {
        throw new Error("Invalid view count");
      }

      const { data: { user } } = await supabase.auth.getUser();
      const { data: translation } = await supabase
        .from('translations')
        .select('metadata')
        .eq('id', translationId)
        .single();

      const metadata = translation?.metadata || {};

      const { error } = await supabase
        .from('translations')
        .update({ 
          view_count: newCount,
          metadata: {
            ...metadata,
            lastManualViewUpdate: new Date().toISOString(),
            lastManualViewUpdateBy: user?.email
          }
        })
        .eq('id', translationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "View count manually updated",
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
              <AlertDialogTitle>Manual View Count Correction</AlertDialogTitle>
              <AlertDialogDescription>
                This is for administrative corrections only. View counts are automatically tracked.
                Are you sure you want to manually override the view count?
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
      <p className="text-sm text-muted-foreground">
        Note: Manual view count adjustment is for administrative corrections only. 
        Views are automatically tracked.
      </p>
    </div>
  );
};