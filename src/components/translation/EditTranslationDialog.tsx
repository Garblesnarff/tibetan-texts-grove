import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Translation } from "@/types/translation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";
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

interface EditTranslationDialogProps {
  translation: Translation;
  onUpdate: () => void;
}

export function EditTranslationDialog({ translation, onUpdate }: EditTranslationDialogProps) {
  const [title, setTitle] = useState(translation.title);
  const [tibetanTitle, setTibetanTitle] = useState(translation.tibetan_title || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('translations')
        .update({ 
          title,
          tibetan_title: tibetanTitle || null
        })
        .eq('id', translation.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation updated successfully",
      });
      
      setIsOpen(false);
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating translation",
        description: error.message
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', translation.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting translation",
        description: error.message
      });
    }
  };

  return (
    <div className="flex gap-3">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white border-2 border-primary shadow-lg h-12 w-12"
          >
            <Pencil className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Translation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tibetanTitle">Tibetan Title</Label>
              <Input
                id="tibetanTitle"
                value={tibetanTitle}
                onChange={(e) => setTibetanTitle(e.target.value)}
                className="font-tibetan"
              />
            </div>
            <Button onClick={handleUpdate} className="w-full">
              Update Translation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            size="lg"
            className="bg-destructive hover:bg-destructive/90 text-white border-2 border-destructive shadow-lg h-12 w-12"
          >
            <Trash2 className="h-6 w-6" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the translation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
