import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FeaturedToggleProps {
  translationId: string;
  featured: boolean;
  onUpdate: () => Promise<void>;
}

export const FeaturedToggle = ({ translationId, featured, onUpdate }: FeaturedToggleProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleToggleFeatured = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
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
  );
};