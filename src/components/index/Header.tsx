import { AdminUpload } from "@/components/AdminUpload";

/**
 * Header component for the Index page
 * Displays the main title and upload button
 */
export const Header = () => (
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-3xl font-bold text-tibetan-maroon">
      Tibetan Translation Hub
    </h1>
    <AdminUpload />
  </div>
);