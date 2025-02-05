import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = useCallback(async () => {
    // First check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[useAuth] Development mode detected - granting admin access');
      setIsAdmin(true);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const isAdminEmail = user?.email === 'wonky.coin@gmail.com';
      
      console.log('[useAuth] Checking admin status:', { 
        email: user?.email,
        isAdminEmail,
        isDevelopment: process.env.NODE_ENV === 'development'
      });
      
      setIsAdmin(isAdminEmail);
    } catch (error) {
      console.error('[useAuth] Error checking admin status:', error);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    checkAdminStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  return { isAdmin };
};