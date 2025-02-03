import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ViewCountResetDialog } from "./ViewCountResetDialog";
import { useViewCount } from "@/hooks/useViewCount";

interface ViewCountManagerProps {
  translationId: string;
  viewCount: number;
  onUpdate: () => Promise<void>;
}

export const ViewCountManager = ({ 
  translationId, 
  viewCount: initialViewCount, 
  onUpdate 
}: ViewCountManagerProps) => {
  const {
    viewCount,
    setViewCount,
    isUpdating,
    handleUpdateViewCount,
    handleResetViewCount
  } = useViewCount({
    translationId,
    initialCount: initialViewCount,
    onUpdate
  });

  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={viewCount}
          onChange={(e) => setViewCount(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="w-32"
          min="0"
        />
        <Button
          onClick={() => handleUpdateViewCount(viewCount)}
          disabled={isUpdating || viewCount === initialViewCount.toString()}
        >
          Update Views
        </Button>
        <ViewCountResetDialog
          onReset={handleResetViewCount}
          isUpdating={isUpdating}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Note: Manual view count adjustment is for administrative corrections only. 
        Views are automatically tracked.
      </p>
    </div>
  );
};