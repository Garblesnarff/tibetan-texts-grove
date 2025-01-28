import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface PDFLoadingOverlayProps {
  loadingProgress: number;
}

export const PDFLoadingOverlay: React.FC<PDFLoadingOverlayProps> = ({
  loadingProgress,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 p-4">
      <Skeleton className="h-[600px] w-full mb-4" />
      <Progress value={loadingProgress} className="w-full max-w-md mb-2" />
      <p className="text-sm text-muted-foreground">
        Loading PDF... {loadingProgress}%
      </p>
    </div>
  );
};