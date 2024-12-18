import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, FolderDown } from "lucide-react";
import { Translation } from "@/types/translation";
import { supabase } from "@/integrations/supabase/client";
import DeleteTranslationDialog from "./translation/DeleteTranslationDialog";
import TranslationCard from "./translation/TranslationCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface TranslationViewerProps {
  translations: Translation[];
  onDelete: (id: string) => Promise<void>;
}

const hasOriginalTibetanFileName = (metadata: Translation['metadata']): metadata is { originalTibetanFileName?: string } & Record<string, unknown> => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return false;
  return 'originalTibetanFileName' in metadata;
};

const TranslationViewer = ({ translations, onDelete }: TranslationViewerProps) => {
  const navigate = useNavigate();
  const code = translations[0]?.title.split(' ')[0];
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentTranslation, setCurrentTranslation] = React.useState(translations[0]);
  const [categories, setCategories] = React.useState<Array<{ id: string; title: string }>>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, title')
        .order('title');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.delete-button, .edit-button, .category-button, [role="menuitem"]')) {
      e.stopPropagation();
      return;
    }
    if (translations.length > 0) {
      navigate(`/translation/${translations[0].id}`);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('id', translations[0].id)
        .single();
        
      if (error) {
        console.error('Error fetching updated translation:', error);
        return;
      }
      
      if (data) {
        console.log('Updated translation data:', data);
        setCurrentTranslation(data);
      }
    } catch (err) {
      console.error('Error in handleUpdate:', err);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    try {
      console.log('Updating category for translation:', translations[0].id, 'to category:', categoryId);
      
      const { error } = await supabase
        .from('translations')
        .update({ category_id: categoryId })
        .eq('id', translations[0].id);

      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Translation moved to new category",
      });

      await handleUpdate();
    } catch (error: any) {
      console.error('Error in handleCategoryChange:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to move translation to new category",
      });
    }
  };

  const englishTranslation = currentTranslation;
  const tibetanTranslation = currentTranslation;
  const originalTibetanTitle = hasOriginalTibetanFileName(tibetanTranslation?.metadata) 
    ? tibetanTranslation.metadata.originalTibetanFileName 
    : undefined;

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow relative min-h-[200px]" 
      onClick={handleClick}
    >
      <div className="absolute top-2 right-2 z-50 flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 category-button hover:bg-tibetan-brown/10"
            >
              <FolderDown className="h-4 w-4 text-tibetan-brown" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 z-[100] bg-background border border-tibetan-brown/20 shadow-lg"
          >
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className="cursor-pointer hover:bg-tibetan-brown/10 focus:bg-tibetan-brown/20"
              >
                {category.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 edit-button hover:bg-tibetan-brown/10"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4 text-tibetan-brown" />
        </Button>
        <DeleteTranslationDialog 
          onDelete={() => onDelete(translations[0].id)} 
        />
      </div>
      <div className="pt-10">
        <TranslationCard
          code={code}
          englishTitle={englishTranslation?.title}
          tibetanTitle={tibetanTranslation?.tibetan_title}
          originalTibetanFileName={originalTibetanTitle}
          translationId={translations[0].id}
          onUpdate={handleUpdate}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
        />
      </div>
    </Card>
  );
};

export default TranslationViewer;