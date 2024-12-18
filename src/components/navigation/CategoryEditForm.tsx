import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface EditingCategory {
  id: string;
  title: string;
  description: string;
  isNew?: boolean;
}

interface CategoryEditFormProps {
  category: EditingCategory;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updatedCategory: EditingCategory) => void;
}

/**
 * CategoryEditForm Component
 * Renders a form for editing or creating a category
 * @param category - The category being edited or created
 * @param onSave - Callback function when save button is clicked
 * @param onCancel - Callback function when cancel button is clicked
 * @param onChange - Callback function when form fields change
 */
export function CategoryEditForm({ 
  category, 
  onSave, 
  onCancel, 
  onChange 
}: CategoryEditFormProps) {
  return (
    <div className="space-y-2 p-2 border rounded-md">
      <Input
        placeholder="Category Title"
        value={category.title}
        onChange={(e) => onChange({
          ...category,
          title: e.target.value
        })}
      />
      <Input
        placeholder="Description"
        value={category.description}
        onChange={(e) => onChange({
          ...category,
          description: e.target.value
        })}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}