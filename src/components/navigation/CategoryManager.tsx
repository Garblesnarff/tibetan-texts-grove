import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CategoryEditForm } from "./CategoryEditForm";
import { CategoryAddButton } from "./category/CategoryAddButton";
import { CategoryDeleteDialog } from "./category/CategoryDeleteDialog";

interface Category {
  id: string;
  title: string;
  description: string;
}

interface EditingCategory extends Category {
  isNew?: boolean;
}

interface CategoryManagerProps {
  onCategoryChange: () => void;
}

/**
 * CategoryManager Component
 * Manages the creation, editing, and deletion of categories
 * Only visible to admin users
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onCategoryChange - Callback function to refresh the category list
 */
export function CategoryManager({ onCategoryChange }: CategoryManagerProps) {
  const { isAdmin } = useAuth();
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { toast } = useToast();

  // If user is not admin, don't render anything
  if (!isAdmin) {
    return null;
  }

  /**
   * Initializes the form for adding a new category
   */
  const handleAdd = () => {
    setEditingCategory({
      id: "",
      title: "",
      description: "",
      isNew: true
    });
  };

  /**
   * Handles the saving of a new or edited category
   * Shows success/error toast messages and triggers category list refresh
   */
  const handleSave = async () => {
    if (!editingCategory) return;

    try {
      if (editingCategory.isNew) {
        const { error } = await supabase
          .from('categories')
          .insert([{
            title: editingCategory.title,
            description: editingCategory.description
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Category added successfully"
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .update({
            title: editingCategory.title,
            description: editingCategory.description
          })
          .eq('id', editingCategory.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Category updated successfully"
        });
      }
      
      onCategoryChange();
      setEditingCategory(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  /**
   * Handles the actual deletion of a category after confirmation
   */
  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Category deleted successfully"
      });
      
      onCategoryChange();
      setCategoryToDelete(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <CategoryAddButton onClick={handleAdd} />
      
      {editingCategory && (
        <CategoryEditForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => setEditingCategory(null)}
          onChange={setEditingCategory}
        />
      )}

      <CategoryDeleteDialog
        category={categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}