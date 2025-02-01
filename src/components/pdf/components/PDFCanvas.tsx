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

  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current || !containerRef.current) return;

      try {
        // Get the page
        const page = await pdf.getPage(currentPage);
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

        // Create new viewport with the calculated scale and explicit rotation
        const scaledViewport = page.getViewport({ 
          scale,
          rotation: 0 // Ensure correct orientation
        });

        // Set canvas dimensions
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        // Reset any existing transformations
        context.setTransform(1, 0, 0, 1, 0, 0);

        // Render the page with explicit transform matrix
        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
          transform: [1, 0, 0, 1, 0, 0] // Identity matrix to maintain orientation
        }).promise;

      } catch (err) {
        console.error('Error rendering page:', err);
        onError('Failed to render page. Please try again.');
      }
    };

    renderPage();

    // Cleanup
    return () => {
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