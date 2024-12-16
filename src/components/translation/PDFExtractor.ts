import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/**
 * Extracts text content from a PDF file
 * @param url - URL of the PDF file to extract text from
 * @returns Promise containing the extracted text
 */
export async function extractTextFromPDF(url: string): Promise<string> {
  try {
    // Load the PDF document
    const loadingTask = pdfjs.getDocument(url);
    const pdf = await loadingTask.promise;

    // Extract text from all pages
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw error;
  }
}