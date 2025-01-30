import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSuggestionAnalytics = () => {
  const { toast } = useToast();

  const trackSuggestionUsage = useCallback(async (suggestionId: string, actionType: string) => {
    try {
      const { error } = await supabase
        .from('suggestion_analytics')
        .insert([{ suggestion_id: suggestionId, action_type: actionType }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking suggestion usage:', error);
      toast({
        variant: "destructive",
        title: "Analytics Error",
        description: "Failed to track suggestion usage"
      });
    }
  }, [toast]);

  return { trackSuggestionUsage };
};