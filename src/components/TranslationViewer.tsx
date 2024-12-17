import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Translation } from "@/types/translation";
import DeleteTranslationDialog from "./translation/DeleteTranslationDialog";
import TranslationCard from "./translation/TranslationCard";

interface TranslationViewerProps {
  translations: Translation[];
  onDelete: (id: string) => Promise<void>;
}

/**
 * Type guard to check if metadata has the correct structure
 * @param metadata - The metadata object to check
 * @returns boolean indicating if the metadata has the correct structure
 */
const hasOriginalTibetanFileName = (metadata: Translation['metadata']): metadata is { originalTibetanFileName?: string } & Record<string, unknown> => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return false;
  return 'originalTibetanFileName' in metadata;
};

/**
 * TranslationViewer Component
 * Container component that handles translation display and deletion
 * 
 * @param {Object} props - Component props
 * @param {Translation[]} props.translations - Array of translations to display
 * @param {Function} props.onDelete - Callback function to handle translation deletion
 */
const TranslationViewer = ({ translations, onDelete }: TranslationViewerProps) => {
  const navigate = useNavigate();
  const code = translations[0]?.title.split(' ')[0];
  const [isEditing, setIsEditing] = React.useState(false);

  /**
   * Handles click events on the translation card
   * @param {React.MouseEvent} e - The click event object
   */
  const handleClick = (e: React.MouseEvent) => {
    // Prevent click event from bubbling up when clicking delete or edit buttons
    if ((e.target as HTMLElement).closest('.delete-button, .edit-button, button')) {
      e.stopPropagation();
      return;
    }
    // Navigate to the first translation's detail page
    if (translations.length > 0) {
      navigate(`/translation/${translations[0].id}`);
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
      <div className="absolute top-2 right-2 z-50 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 edit-button"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <DeleteTranslationDialog 
          onDelete={() => onDelete(translations[0].id)} 
        />
      </div>
      <TranslationCard
        code={code}
        englishTitle={englishTranslation?.title}
        tibetanTitle={tibetanTranslation?.tibetan_title}
        originalTibetanFileName={originalTibetanTitle}
        translationId={translations[0].id}
        onUpdate={() => window.location.reload()}
        isEditing={isEditing}
        onEditingChange={setIsEditing}
      />
    </Card>
  );
};

export default TranslationViewer;