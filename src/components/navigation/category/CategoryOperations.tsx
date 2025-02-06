import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/category";

interface CategoryOperationsProps {
  onSuccess: () => void;
  children: (handlers: {
    handleSave: (category: Omit<Category, 'id'>) => Promise<void>;
    handleDelete: (category: Category) => Promise<void>;
  }) => React.ReactNode;
}

export function CategoryOperations({ onSuccess, children }: CategoryOperationsProps) {
  const { toast } = useToast();

  const handleSave = async (category: Omit<Category, 'id'>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .insert([category]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category added successfully"
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  return children({ handleSave, handleDelete });
}