import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Translation } from "@/types/translation";
import { Json } from "@/integrations/supabase/types";
import { EditTranslationDialog } from "./translation/EditTranslationDialog";

interface TranslationViewerProps {
  translations: Translation[];
  onUpdate?: () => void;
}

// Type guard to check if metadata has the correct structure
const hasOriginalTibetanFileName = (metadata: Translation['metadata']): metadata is { originalTibetanFileName?: string } & Record<string, unknown> => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return false;
  return 'originalTibetanFileName' in metadata;
};

const TranslationViewer = ({ translations, onUpdate }: TranslationViewerProps) => {
  const navigate = useNavigate();
  const code = translations[0]?.title.split(' ')[0];

  const handleClick = () => {
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
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer relative" 
    >
      <div 
        className="absolute top-4 right-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {englishTranslation && onUpdate && (
          <EditTranslationDialog 
            translation={englishTranslation}
            onUpdate={onUpdate}
          />
        )}
      </div>
      <div className="mb-6" onClick={handleClick}>
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