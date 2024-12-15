import { AdminUpload } from "@/components/AdminUpload";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tibetan Translation Hub</h1>
      
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <Link to="/translations">
            <Button variant="outline">
              View Translations
            </Button>
          </Link>
        </div>
        
        <AdminUpload />
      </div>
    </div>
  );
}