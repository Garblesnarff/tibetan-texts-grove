import { WifiOff } from "lucide-react";

export function OfflineState() {
  return (
    <div className="p-4 text-center">
      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
        <WifiOff className="h-4 w-4" />
        <span>You are offline</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Search suggestions will be available when you're back online
      </p>
    </div>
  );
}