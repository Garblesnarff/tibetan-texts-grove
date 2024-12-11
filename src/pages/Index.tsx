import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TranslationViewer from "@/components/TranslationViewer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-tibetan-maroon text-white py-6">
        <div className="container">
          <h1 className="text-4xl font-serif font-semibold">Tibetan Translation Hub</h1>
          <p className="mt-2 text-tibetan-gold">Preserving and Sharing Buddhist Wisdom</p>
        </div>
      </header>

      {/* Search Section */}
      <section className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Input
              placeholder="Search translations..."
              className="pl-10 py-6 text-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button variant="outline">Sutras</Button>
            <Button variant="outline">Commentaries</Button>
            <Button variant="outline">Practices</Button>
            <Button variant="outline">Historical Texts</Button>
          </div>
        </div>
      </section>

      {/* Featured Translation */}
      <section className="container py-8">
        <h2 className="text-2xl font-serif mb-6">Featured Translation</h2>
        <TranslationViewer />
      </section>
    </div>
  );
};

export default Index;