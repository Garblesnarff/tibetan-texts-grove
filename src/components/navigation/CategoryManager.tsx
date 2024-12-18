import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

export function CategoryManager({ onCategoryChange }: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { toast } = useToast();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleAdd = () => {
    setEditingCategory({
      id: "",
      title: "",
      description: "",
      isNew: true
    });
  };

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
        
        // Trigger refresh of categories
        onCategoryChange();
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
        
        // Trigger refresh of categories
        onCategoryChange();
      }
      setEditingCategory(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const handleDelete = async (category: Category) => {
    setCategoryToDelete(category);
  };

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
      
      // Trigger refresh of categories
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
        <div className="space-y-2 p-2 border rounded-md">
          <Input
            placeholder="Category Title"
            value={editingCategory.title}
            onChange={(e) => setEditingCategory({
              ...editingCategory,
              title: e.target.value
            })}
          />
          <Input
            placeholder="Description"
            value={editingCategory.description}
            onChange={(e) => setEditingCategory({
              ...editingCategory,
              description: e.target.value
            })}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setEditingCategory(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
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