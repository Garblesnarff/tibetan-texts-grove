import React, { useEffect, useRef, useState } from 'react';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

interface PDFCanvasProps {
  pdf: PDFDocumentProxy | null;
  currentPage: number;
  zoom: number;
  isFitToWidth: boolean;
  onError: (error: string) => void;
}

export const PDFCanvas: React.FC<PDFCanvasProps> = ({
  pdf,
  currentPage,
  zoom,
  isFitToWidth,
  onError,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPageObj, setCurrentPageObj] = useState<PDFPageProxy | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Cleanup function for render operations
  const cleanupRenderOperation = () => {
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current || !containerRef.current) return;

      try {
        // Cleanup previous render operation
        cleanupRenderOperation();

        // Get the page
        const page = await pdf.getPage(currentPage);
        console.log('PDF Page metadata:', {
          rotation: page.rotate,
          pageNumber: page.pageNumber,
          view: page.view,
        });

        setCurrentPageObj(page);

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Calculate the scale based on container width if fitting to width
        const containerWidth = containerRef.current.clientWidth;
        const viewport = page.getViewport({ scale: 1.0 });
        let scale = zoom;

        if (isFitToWidth) {
          // Add padding to prevent touching the edges
          const padding = 40;
          scale = (containerWidth - padding) / viewport.width;
        }

        // Get natural rotation from PDF metadata and create viewport
        const naturalRotation = page.rotate || 0;
        console.log('Using natural rotation:', naturalRotation);
        
        const scaledViewport = page.getViewport({ 
          scale,
          rotation: naturalRotation // Use PDF's natural rotation
        });

        // Set canvas dimensions
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        // Reset any existing transformations
        context.setTransform(1, 0, 0, 1, 0, 0);

        // Render the page
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
          enableWebGL: true,
          renderInteractiveForms: true
        };

        try {
          renderTaskRef.current = page.render(renderContext);
          await renderTaskRef.current.promise;
          console.log('Page rendered successfully with rotation:', naturalRotation);
        } catch (renderError) {
          console.error('Error during render:', renderError);
          onError('Failed to render page. Please try again.');
        }

      } catch (err) {
        console.error('Error rendering page:', err);
        onError('Failed to render page. Please try again.');
      }
    };

    renderPage();

    // Cleanup function
    return () => {
      cleanupRenderOperation();
      if (currentPageObj) {
        currentPageObj.cleanup();
      }
    };
  }, [pdf, currentPage, zoom, isFitToWidth, onError]);

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
};