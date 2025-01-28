import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download, Maximize, Minimize } from 'lucide-react';

interface PDFControlsProps {
  zoom: number;
  isLoading: boolean;
  isFitToWidth: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFitToWidth: () => void;
  onDownload: () => void;
}

export const PDFControls: React.FC<PDFControlsProps> = ({
  zoom,
  isLoading,
  isFitToWidth,
  onZoomIn,
  onZoomOut,
  onToggleFitToWidth,
  onDownload,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        disabled={zoom <= 0.5 || isLoading}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground w-16 text-center">
        {Math.round(zoom * 100)}%
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        disabled={zoom >= 3 || isLoading}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleFitToWidth}
        disabled={isLoading}
      >
        {isFitToWidth ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
        disabled={isLoading}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};