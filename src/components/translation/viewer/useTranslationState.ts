import { useState } from "react";
import { Translation } from "@/types/translation";
import { supabase } from "@/integrations/supabase/client";

export const useTranslationState = (initialTranslation: Translation) => {
  const [currentTranslation, setCurrentTranslation] = useState(initialTranslation);
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
        setCurrentTranslation(data);
      }
    } catch (err) {
      console.error('Error in handleUpdate:', err);
    }
  };

  return {
    currentTranslation,
    isEditing,
    setIsEditing,
    handleUpdate
  };
};