import { AdminUpload } from "@/components/AdminUpload";

export function Header() {
  return (
    <div className="mb-8 text-center">
      <h1 className="mb-2 font-tibetan text-4xl font-bold text-tibetan-maroon">
        བོད་ཀྱི་དཔེ་མཛོད།
      </h1>
      <h2 className="mb-6 font-serif text-2xl text-tibetan-brown">
        Tibetan Translation Library
      </h2>
      <p className="mb-8 max-w-2xl mx-auto text-muted-foreground">
        A curated collection of Buddhist texts translated from Tibetan to English,
        preserving the wisdom and insights of the Tibetan Buddhist tradition.
      </p>
      <AdminUpload />
    </div>
  );
}