import { AdminUpload } from "@/components/AdminUpload";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <div className="relative mb-8 text-center">
      <div className="absolute left-0 top-0">
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-tibetan-brown/10">
            <Home className="h-5 w-5 text-tibetan-brown" />
            <span className="sr-only">Return to Translation Hub</span>
          </Button>
        </Link>
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