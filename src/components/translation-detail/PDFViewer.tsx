import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface PDFViewerProps {
  title: string;
  filePath: string;
  storageUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ title, filePath, storageUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fullUrl = `${storageUrl}/${filePath}`;

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setLoadProgress(0);
    // Force reload the PDF
    const objectElement = document.querySelector(`object[data="${fullUrl}"]`);
    if (objectElement) {
      objectElement.setAttribute('data', fullUrl);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="h-[800px]">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-tibetan-brown">{title}</h4>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-16 text-center">
            {zoom}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <a
            href={fullUrl}
            download
            className="ml-2"
          >
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      <div className="relative h-full border rounded-lg bg-white p-4">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 p-4">
            <Skeleton className="h-[600px] w-full mb-4" />
            <Progress value={loadProgress} className="w-full max-w-md mb-2" />
            <p className="text-sm text-muted-foreground">Loading PDF...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="h-full" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
          <object
            data={fullUrl}
            type="application/pdf"
            className="w-full h-full"
            onLoad={() => {
              setIsLoading(false);
              setLoadProgress(100);
            }}
            onError={() => {
              setError("Failed to load PDF. Please try again.");
              setIsLoading(false);
            }}
          >
            <p>
              Unable to display PDF.{" "}
              <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Download PDF
              </a>{" "}
              instead.
            </p>
          </object>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full shadow-sm border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || '?'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;