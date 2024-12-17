import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TranslationCardProps {
  code: string;
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
  translationId: string;
  onUpdate?: () => void;
}

/**
 * TranslationCard Component
 * Displays translation information in a card format with edit capabilities
 * 
 * @param {Object} props - Component props
 * @param {string} props.code - Translation code
 * @param {string} props.englishTitle - English title of the translation
 * @param {string} props.tibetanTitle - Tibetan title of the translation
 * @param {string} props.originalTibetanFileName - Original Tibetan filename from metadata
 * @param {string} props.translationId - ID of the translation for updates
 * @param {Function} props.onUpdate - Callback function after successful update
 */
const TranslationCard = ({ 
  code, 
  englishTitle, 
  tibetanTitle, 
  originalTibetanFileName,
  translationId,
  onUpdate
}: TranslationCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEnglishTitle, setEditedEnglishTitle] = useState(englishTitle || "");
  const [editedTibetanTitle, setEditedTibetanTitle] = useState(tibetanTitle || "");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('translations')
        .update({
          title: editedEnglishTitle,
          tibetan_title: editedTibetanTitle || null
        })
        .eq('id', translationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Translation titles updated successfully",
      });
      
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating translation",
        description: error.message
      });
    }
  };

  const handleCancel = () => {
    setEditedEnglishTitle(englishTitle || "");
    setEditedTibetanTitle(tibetanTitle || "");
    setIsEditing(false);
  };

  return (
    <div className="mb-6 relative">
      <div className="absolute top-0 right-0 space-x-2">
        {!isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className="h-8 w-8"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <h3 className="text-xl font-semibold mb-2">{code}</h3>
      
      {isEditing ? (
        <div className="space-y-4">
          <Input
            value={editedEnglishTitle}
            onChange={(e) => setEditedEnglishTitle(e.target.value)}
            placeholder="English Title"
            className="w-full"
          />
          <Input
            value={editedTibetanTitle}
            onChange={(e) => setEditedTibetanTitle(e.target.value)}
            placeholder="Tibetan Title"
            className="w-full font-tibetan"
          />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default TranslationCard;