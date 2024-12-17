import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Translation } from "@/types/translation";
import { Json } from "@/integrations/supabase/types";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TranslationViewerProps {
  translations: Translation[];
}

// Type guard to check if metadata has the correct structure
const hasOriginalTibetanFileName = (metadata: Translation['metadata']): metadata is { originalTibetanFileName?: string } & Record<string, unknown> => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return false;
  return 'originalTibetanFileName' in metadata;
};

const TranslationViewer = ({ translations }: TranslationViewerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const code = translations[0]?.title.split(' ')[0];

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click event from bubbling up when clicking delete button
    if ((e.target as HTMLElement).closest('.delete-button')) {
      e.stopPropagation();
      return;
    }
    // Navigate to the first translation's detail page
    if (translations.length > 0) {
      navigate(`/translation/${translations[0].id}`);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', translations[0].id);

      if (error) throw error;

      toast({
        title: "Translation deleted",
        description: "The translation has been successfully deleted.",
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting translation",
        description: error.message,
      });
    }
  };

  // Find the English and Tibetan translations
  const englishTranslation = translations.find(t => !t.tibetan_title);
  const tibetanTranslation = translations.find(t => t.tibetan_title);

  // Get the original Tibetan filename from metadata if available
  const originalTibetanTitle = hasOriginalTibetanFileName(tibetanTranslation?.metadata) 
    ? tibetanTranslation.metadata.originalTibetanFileName 
    : undefined;

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow relative" 
      onClick={handleClick}
    >
      <div className="absolute top-2 right-2 z-50">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="delete-button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the translation
                and all associated files.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{code}</h3>
        {englishTranslation && (
          <p className="text-gray-700 mb-2">
            {englishTranslation.title}
          </p>
        )}
        {(originalTibetanTitle || tibetanTranslation?.tibetan_title) && (
          <p className="text-tibetan-maroon font-tibetan text-xl">
            {originalTibetanTitle || tibetanTranslation?.tibetan_title}
          </p>
        )}
      </div>
    </Card>
  );
};

export default TranslationViewer;