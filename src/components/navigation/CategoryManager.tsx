import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CategoryEditForm } from "./CategoryEditForm";

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
 * @param onCategoryChange - Callback function to refresh the category list
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
        // Handle new category creation
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
        // Handle category update
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
      
      // Refresh category list and reset form
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
   * Opens the delete confirmation dialog
   */
  const handleDelete = async (category: Category) => {
    setCategoryToDelete(category);
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
      
      // Refresh category list and close dialog
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
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={handleAdd}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Category
      </Button>
      
      {editingCategory && (
        <CategoryEditForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => setEditingCategory(null)}
          onChange={setEditingCategory}
        />
      )}

      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category
              "{categoryToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
