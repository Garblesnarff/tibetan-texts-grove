import { AdminUpload } from "@/components/AdminUpload";
import { Link } from "react-router-dom";
import { Home, Settings, Folder, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { isAdmin } = useAuth();

  return (
    <div className="relative mb-8 text-center">
      <div className="absolute left-0 top-0 flex gap-2">
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-tibetan-brown/10">
            <Home className="h-5 w-5 text-tibetan-brown" />
            <span className="sr-only">Return to Translation Hub</span>
          </Button>
        </Link>
        <Link to="/categories">
          <Button variant="ghost" size="icon" className="hover:bg-tibetan-brown/10">
            <Folder className="h-5 w-5 text-tibetan-brown" />
            <span className="sr-only">Browse Categories</span>
          </Button>
        </Link>
        <Link to="/search">
          <Button variant="ghost" size="icon" className="hover:bg-tibetan-brown/10">
            <Search className="h-5 w-5 text-tibetan-brown" />
            <span className="sr-only">Search Translations</span>
          </Button>
        </Link>
        {isAdmin && (
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="hover:bg-tibetan-brown/10">
              <Settings className="h-5 w-5 text-tibetan-brown" />
              <span className="sr-only">Admin Dashboard</span>
            </Button>
          </Link>
        )}
      </div>
      <h1 className="mb-2 font-tibetan text-4xl font-bold text-tibetan-maroon">
        བོད་ཀྱི་དཔེ་མཛོད།
      </h1>
      <h2 className="mb-6 font-serif text-2xl text-tibetan-brown">
        Tibetan Translation Library
      </h2>
      <p className="mb-8 max-w-2xl mx-auto text-muted-foreground">
        A curated collection of Buddhist texts translated from Tibetan to English,
        preserving the wisdom and insights of the Tibetan Buddhist tradition. -As translated by Google Gemini
      </p>
      <AdminUpload />
    </div>
  );
}