import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tibetan Translation Hub</h1>
      <Button asChild>
        <Link to="/translations">View Translations</Link>
      </Button>
    </div>
  );
}