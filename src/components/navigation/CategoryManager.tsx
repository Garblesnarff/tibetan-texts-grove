import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CategoryEditForm } from "./CategoryEditForm";
import { CategoryAddButton } from "./category/CategoryAddButton";
import { CategoryDeleteDialog } from "./category/CategoryDeleteDialog";
import { CategoryOperations } from "./category/CategoryOperations";
import { Category } from "@/types/category";

interface CategoryManagerProps {
  onCategoryChange: () => void;
}

interface EditingCategory {
  id: string;
  title: string;
  description: string;
  isNew?: boolean;
}

export function CategoryManager({ onCategoryChange }: CategoryManagerProps) {
  const { isAdmin } = useAuth();
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  console.log('[CategoryManager] Rendering with isAdmin:', isAdmin);

  // If user is not admin, don't render anything
  if (!isAdmin) {
    console.log('[CategoryManager] User is not admin, hiding category management controls');
    return null;
  }

  const handleAdd = () => {
    console.log('[CategoryManager] Adding new category');
    setEditingCategory({
      id: "",
      title: "",
      description: "",
      isNew: true
    });
  };

  return (
    <div className="mt-4 space-y-2">
      <CategoryOperations onSuccess={onCategoryChange}>
        {({ handleSave, handleDelete }) => (
          <>
            <CategoryAddButton onClick={handleAdd} />
            
            {editingCategory && (
              <CategoryEditForm
                category={editingCategory}
                onSave={() => {
                  handleSave({
                    title: editingCategory.title,
                    description: editingCategory.description,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by: null
                  });
                  setEditingCategory(null);
                }}
                onCancel={() => setEditingCategory(null)}
                onChange={(updated: EditingCategory) => setEditingCategory(updated)}
              />
            )}

            <CategoryDeleteDialog
              category={categoryToDelete}
              onClose={() => setCategoryToDelete(null)}
              onConfirm={async () => {
                if (categoryToDelete) {
                  await handleDelete(categoryToDelete);
                  setCategoryToDelete(null);
                }
              }}
            />
          </>
        )}
      </CategoryOperations>
    </div>
  );
}