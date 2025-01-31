import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTranslationViews = (translationId: string, onViewCountUpdate: (newCount: number) => void) => {
  const { toast } = useToast();

  useEffect(() => {
    const recordView = async () => {
      try {
        // First check if a view already exists
        const { data: existingView, error: checkError } = await supabase
          .from('translation_views')
          .select('id')
          .eq('translation_id', translationId)
          .eq('viewer_ip', 'anonymous')
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing view:', checkError);
          return;
        }

        // Only insert if no existing view is found
        if (!existingView) {
          const { error: insertError } = await supabase
            .from('translation_views')
            .insert({
              translation_id: translationId,
              viewer_ip: 'anonymous' // For privacy, we're using a placeholder
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error recording view:', insertError);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to record view"
            });
          }
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
  }, [translationId, onViewCountUpdate, toast]);
};