import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { usePDFDocument } from './hooks/usePDFDocument';
import { PDFControls } from './components/PDFControls';
import { PDFPageNavigation } from './components/PDFPageNavigation';
import { PDFLoadingOverlay } from './components/PDFLoadingOverlay';
import { PDFCanvas } from './components/PDFCanvas';

interface PDFViewerEnhancedProps {
  url: string;
  title: string;
}

const PDFViewerEnhanced: React.FC<PDFViewerEnhancedProps> = ({ url, title }) => {
  const { pdf, isLoading, loadingProgress, error, handleRetry } = usePDFDocument(url);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.2);
  const [isFitToWidth, setIsFitToWidth] = useState(true);

  useEffect(() => {
    if (pdf) {
      setTotalPages(pdf.numPages);
    }
  }, [pdf]);

  const handleZoomIn = () => {
    setIsFitToWidth(false);
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setIsFitToWidth(false);
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  
  const toggleFitToWidth = () => {
    setIsFitToWidth(prev => !prev);
    if (!isFitToWidth) {
      setZoom(1.2);
    }
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    link.click();
  };

  if (error) {
    return (
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
    );
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4">
        <h4 className="font-semibold text-tibetan-brown text-lg">{title}</h4>
        <PDFControls
          zoom={zoom}
          isLoading={isLoading}
          isFitToWidth={isFitToWidth}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onToggleFitToWidth={toggleFitToWidth}
          onDownload={handleDownload}
        />
      </div>

      <div className="relative border rounded-lg bg-white p-2 sm:p-4 h-[calc(100%-4rem)]">
        {isLoading && <PDFLoadingOverlay loadingProgress={loadingProgress} />}

        <ScrollArea className="h-full w-full">
          <div className="flex justify-center min-h-full">
            <PDFCanvas
              pdf={pdf}
              currentPage={currentPage}
              zoom={zoom}
              isFitToWidth={isFitToWidth}
              onError={(error) => console.error(error)}
            />
          </div>
        </ScrollArea>

        <PDFPageNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </div>
    </div>
  );
};

export default PDFViewerEnhanced;