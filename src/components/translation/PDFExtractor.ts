import * as pdfjs from 'pdfjs-dist';

/**
 * Configures the PDF.js worker
 * Uses CDN version of the worker file for better compatibility
 */
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Extracts text content from a PDF file
 * 
 * @param {string} url - The URL of the PDF file to extract text from
 * @returns {Promise<string>} The extracted text content
 * @throws {Error} If the PDF fetch or text extraction fails
 */
export async function extractTextFromPDF(url: string): Promise<string> {
  try {
    // Fetch the PDF as ArrayBuffer
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch PDF');
    
    const arrayBuffer = await response.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
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
    console.error("Error extracting PDF text:", error);
    throw new Error("Failed to extract PDF text");
  }
}