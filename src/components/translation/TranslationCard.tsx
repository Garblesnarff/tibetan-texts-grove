import { Card } from "@/components/ui/card";
import { Translation } from "@/types/translation";

interface TranslationCardProps {
  code: string;
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
}

/**
 * TranslationCard Component
 * Displays translation information in a card format
 * 
 * @param {Object} props - Component props
 * @param {string} props.code - Translation code
 * @param {string} props.englishTitle - English title of the translation
 * @param {string} props.tibetanTitle - Tibetan title of the translation
 * @param {string} props.originalTibetanFileName - Original Tibetan filename from metadata
 */
const TranslationCard = ({ 
  code, 
  englishTitle, 
  tibetanTitle, 
  originalTibetanFileName 
}: TranslationCardProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">{code}</h3>
      {englishTitle && (
        <p className="text-gray-700 mb-2">
          {englishTitle}
        </p>
      )}
      {(originalTibetanFileName || tibetanTitle) && (
        <p className="text-tibetan-maroon font-tibetan text-xl">
          {originalTibetanFileName || tibetanTitle}
        </p>
      )}
    </div>
  );
};

export default TranslationCard;