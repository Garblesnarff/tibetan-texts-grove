import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';
import PDFWorker from 'pdfjs-dist/build/pdf.worker?worker';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFWorker;

export const usePDFDocument = (url: string) => {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@4.0.379/cmaps/',
          cMapPacked: true,
        });

        loadingTask.onProgress = (progress) => {
          const percentage = (progress.loaded / progress.total) * 100;
          setLoadingProgress(Math.round(percentage));
        };

        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setRetryCount(0);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. Please try again.');
        
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(loadPDF, 1000 * (retryCount + 1));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [url, retryCount]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setLoadingProgress(0);
    setPdf(null);
    setRetryCount(0);
  };

  return {
    pdf,
    isLoading,
    loadingProgress,
    error,
    handleRetry
  };
};