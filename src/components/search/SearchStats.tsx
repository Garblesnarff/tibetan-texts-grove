import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock } from "lucide-react";

interface SearchStatsProps {
  count: number;
  time: number;
  showStats: boolean;
}

export function SearchStats({ count, time, showStats }: SearchStatsProps) {
  if (!showStats) return null;

  return (
    <Alert className="bg-muted">
      <AlertDescription className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Found {count} results in {time} seconds
      </AlertDescription>
    </Alert>
  );
}