import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = useCallback(async () => {
    // In development, always grant admin access
    if (process.env.NODE_ENV === 'development') {
      setIsAdmin(true);
      return;
    }

    // In production, check for specific admin email
    const { data: { user } } = await supabase.auth.getUser();
    setIsAdmin(user?.email === 'wonky.coin@gmail.com');
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