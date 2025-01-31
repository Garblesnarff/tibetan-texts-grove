import { useState } from "react";
import { Translation, parseTranslation } from "@/types/translation";
import { supabase } from "@/integrations/supabase/client";

interface Version {
  id: string;
  version_number: number;
  title: string;
  tibetan_title: string | null;
  description: string | null;
  created_at: string;
  created_by: string | null;
}

export const useTranslationState = (initialTranslation: Translation) => {
  const [currentTranslation, setCurrentTranslation] = useState(initialTranslation);
  const [currentVersion, setCurrentVersion] = useState<Version | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('id', initialTranslation.id)
        .single();
        
      if (error) {
        console.error('Error fetching updated translation:', error);
        return;
      }
      
      if (data) {
        setCurrentTranslation(parseTranslation(data));
        setCurrentVersion(null); // Reset version when updating
      }
    } catch (err) {
      console.error('Error in handleUpdate:', err);
    }
  };

  const handleVersionSelect = async (version: Version) => {
    setCurrentVersion(version);
    setCurrentTranslation({
      ...currentTranslation,
      title: version.title,
      tibetan_title: version.tibetan_title,
      description: version.description
    });
  };

  return {
    currentTranslation,
    currentVersion,
    isEditing,
    setIsEditing,
    handleUpdate,
    handleVersionSelect
  };
};