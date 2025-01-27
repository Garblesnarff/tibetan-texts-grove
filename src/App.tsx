import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CategorySidebar } from "@/components/navigation/CategorySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Home from "@/pages/Home"; // Example import for a route
import About from "@/pages/About"; // Example import for a route
import NotFound from "@/pages/NotFound"; // Example import for a route

function App() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <CategorySidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}

export default App;
