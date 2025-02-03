import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ViewCountResetDialogProps {
  onReset: () => Promise<void>;
  isUpdating: boolean;
}

export const ViewCountResetDialog = ({ onReset, isUpdating }: ViewCountResetDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          disabled={isUpdating} 
          onClick={(e) => e.stopPropagation()}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Manual View Count Correction</AlertDialogTitle>
          <AlertDialogDescription>
            This is for administrative corrections only. View counts are automatically tracked.
            Are you sure you want to manually override the view count?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onReset}>
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};