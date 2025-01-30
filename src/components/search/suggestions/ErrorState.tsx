import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="p-4 text-center">
      <div className="flex items-center justify-center gap-2 text-destructive mb-2">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="mt-2"
      >
        <RefreshCcw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    </div>
  );
}