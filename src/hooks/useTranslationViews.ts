import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTranslationViews = (translationId: string, onViewCountUpdate: (newCount: number) => void) => {
  const { toast } = useToast();

  useEffect(() => {
    const recordView = async () => {
      try {
        const { error } = await supabase
          .from('translation_views')
          .insert({
            translation_id: translationId,
            viewer_ip: 'anonymous' // For privacy, we're using a placeholder
          })
          .single();

        if (error && !error.message.includes('unique constraint')) {
          console.error('Error recording view:', error);
        }
      } catch (error) {
        console.error('Error in recordView:', error);
      }
    };

    // Record the view when component mounts
    recordView();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('translation_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'translations',
          filter: `id=eq.${translationId}`
        },
        (payload: any) => {
          if (payload.new && typeof payload.new.view_count === 'number') {
            onViewCountUpdate(payload.new.view_count);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [translationId, onViewCountUpdate]);
};