import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseViewCountProps {
  translationId: string;
  initialCount: number;
  onUpdate: () => Promise<void>;
}

export const useViewCount = ({ translationId, initialCount, onUpdate }: UseViewCountProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewCount, setViewCount] = useState(initialCount.toString());
  const { toast } = useToast();

  const handleUpdateViewCount = async (newCount: string) => {
    try {
      setIsUpdating(true);
      const count = parseInt(newCount);
      
      if (isNaN(count) || count < 0) {
        throw new Error("Invalid view count");
      }

      const { data: { user } } = await supabase.auth.getUser();
      const { data: translation } = await supabase
        .from('translations')
        .select('metadata')
        .eq('id', translationId)
        .single();

      const currentMetadata = translation?.metadata as Record<string, any> || {};
      const updatedMetadata = {
        ...currentMetadata,
        lastManualViewUpdate: new Date().toISOString(),
        lastManualViewUpdateBy: user?.email
      };

      const { error } = await supabase
        .from('translations')
        .update({ 
          view_count: count,
          metadata: updatedMetadata
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

      setViewCount("0");
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

  return {
    viewCount,
    setViewCount,
    isUpdating,
    handleUpdateViewCount,
    handleResetViewCount
  };
};