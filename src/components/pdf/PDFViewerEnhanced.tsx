import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
} from 'lucide-react';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerEnhancedProps {
  url: string;
  title: string;
}

const PDFViewerEnhanced: React.FC<PDFViewerEnhancedProps> = ({ url, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isFitToWidth, setIsFitToWidth] = useState(false);

  // Load PDF document
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/cmaps/',
          cMapPacked: true,
        });

        loadingTask.onProgress = (progress) => {
          const percentage = (progress.loaded / progress.total) * 100;
          setLoadingProgress(Math.round(percentage));
        };

        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [url]);

  // Render PDF page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;

      try {
        const page = await pdf.getPage(currentPage);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        const viewport = page.getViewport({ scale: zoom });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (isFitToWidth && canvasRef.current.parentElement) {
          const parentWidth = canvasRef.current.parentElement.clientWidth;
          const scale = parentWidth / viewport.width;
          const adjustedViewport = page.getViewport({ scale });
          canvas.height = adjustedViewport.height;
          canvas.width = adjustedViewport.width;
          setZoom(scale);
        }

        await page.render({
          canvasContext: context,
          viewport: isFitToWidth ? page.getViewport({ scale: zoom }) : viewport,
        }).promise;
      } catch (err) {
        console.error('Error rendering page:', err);
        setError('Failed to render page. Please try again.');
      }
    };

    renderPage();
  }, [pdf, currentPage, zoom, isFitToWidth]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const toggleFitToWidth = () => setIsFitToWidth(prev => !prev);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    link.click();
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setLoadingProgress(0);
    setPdf(null);
    setCurrentPage(1);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-tibetan-brown">{title}</h4>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
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
            onClick={handleZoomIn}
            disabled={zoom >= 3 || isLoading}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFitToWidth}
            disabled={isLoading}
          >
            {isFitToWidth ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative border rounded-lg bg-white p-4">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10 p-4">
            <Skeleton className="h-[600px] w-full mb-4" />
            <Progress value={loadingProgress} className="w-full max-w-md mb-2" />
            <p className="text-sm text-muted-foreground">Loading PDF... {loadingProgress}%</p>
          </div>
        )}

        <ScrollArea className="h-[700px] w-full">
          <div className="flex justify-center min-h-full">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>
        </ScrollArea>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full shadow-sm border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage <= 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewerEnhanced;