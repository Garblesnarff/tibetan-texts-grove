import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CategorySidebar } from "@/components/navigation/CategorySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import TranslationDetail from "./pages/TranslationDetail";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <CategorySidebar />
          <main className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/translation/:id" element={<TranslationDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;