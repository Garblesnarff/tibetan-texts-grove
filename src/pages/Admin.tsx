import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { AdminUpload } from "@/components/AdminUpload";
import { useAuth } from "@/hooks/useAuth";

/**
 * Admin page component
 * Handles authentication and displays admin-only features
 */
export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    // Check if user is already logged in and is admin
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email === 'wonky.coin@gmail.com') {
        console.log('Admin logged in');
      }
    });
  }, [navigate]);

  // If user is admin, show admin features
  if (isAdmin) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid gap-6">
          <section className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Upload Translations</h2>
            <AdminUpload />
          </section>
        </div>
      </div>
    );
  }

  // If not admin, show login screen
  return (
    <div className="container mx-auto max-w-[400px] p-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Admin Login</h1>
      <div className="border rounded-lg p-4 bg-card">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
        />
      </div>
    </div>
  );
}