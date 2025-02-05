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

    // If not in development, check for admin email
    const { data: { user } } = await supabase.auth.getUser();
    const isAdminEmail = user?.email === 'wonky.coin@gmail.com';
    
    console.log('[useAuth] Checking admin status:', { 
      email: user?.email,
      isAdminEmail,
      isDevelopment: process.env.NODE_ENV === 'development'
    });
    
    setIsAdmin(isAdminEmail);
  }, []);

  useEffect(() => {
    checkAdminStatus();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  return { isAdmin };
};