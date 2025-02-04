import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CategorySelectProps {
  translationId: string;
  onUpdate: () => Promise<void>;
  categories: Array<{ id: string; title: string }>;
}

export const CategorySelect = ({
  translationId,
  onUpdate,
  categories,
}: CategorySelectProps) => {
  const { toast } = useToast();

  const handleCategoryChange = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('translations')
        .update({ category_id: categoryId })
        .eq('id', translationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation moved to new category",
      });

      await onUpdate();
    } catch (error: any) {
      console.error('Error in handleCategoryChange:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to move translation to new category",
      });
    }
  };

  return (
    <div className="category-select">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className="category-button"
        >
          {category.title}
        </button>
      ))}
    </div>
  );
};