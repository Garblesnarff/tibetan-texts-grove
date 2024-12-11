import { AdminUpload } from "@/components/AdminUpload";

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tibetan Translation Hub</h1>
      <AdminUpload />
    </div>
  );
}