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
}

interface CategoryDeleteDialogProps {
  category: Category | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

/**
 * CategoryDeleteDialog Component
 * Displays a confirmation dialog when deleting a category
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Category | null} props.category - The category to be deleted
 * @param {Function} props.onClose - Callback to close the dialog
 * @param {Function} props.onConfirm - Callback to confirm deletion
 */
export function CategoryDeleteDialog({ 
  category, 
  onClose, 
  onConfirm 
}: CategoryDeleteDialogProps) {
  return (
    <AlertDialog open={!!category} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the category
            "{category?.title}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}