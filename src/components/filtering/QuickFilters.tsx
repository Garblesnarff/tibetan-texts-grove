import { Button } from "@/components/ui/button";
import { Star, Clock, Eye } from "lucide-react";

interface QuickFiltersProps {
  onFilterChange: (filterId: string) => void;
  activeFilters: string[];
}

export const QuickFilters = ({ onFilterChange, activeFilters }: QuickFiltersProps) => {
  const filters = [
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'most-viewed', label: 'Most Viewed', icon: Eye },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={activeFilters.includes(id) ? "default" : "outline"}
          size="sm"
          className="transition-all duration-200"
          onClick={() => onFilterChange(id)}
        >
          <Icon className="h-4 w-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
};