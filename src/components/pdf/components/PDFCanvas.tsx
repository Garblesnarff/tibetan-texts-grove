import React, { useEffect, useRef } from 'react';
import { PDFDocumentProxy } from 'pdfjs-dist';

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
        }

        await page.render({
          canvasContext: context,
          viewport: isFitToWidth ? page.getViewport({ scale: zoom }) : viewport,
        }).promise;
      } catch (err) {
        console.error('Error rendering page:', err);
        onError('Failed to render page. Please try again.');
      }
    };

    renderPage();
  }, [pdf, currentPage, zoom, isFitToWidth, onError]);

  return <canvas ref={canvasRef} className="max-w-full" />;
};