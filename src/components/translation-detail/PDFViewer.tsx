import React from 'react';

interface PDFViewerProps {
  title: string;
  filePath: string;
  storageUrl: string;
}

/**
 * PDFViewer Component
 * Renders a PDF document viewer with download functionality
 * 
 * @param {string} title - The title of the PDF section
 * @param {string} filePath - The path to the PDF file in storage
 * @param {string} storageUrl - The base URL for the storage bucket
 */
const PDFViewer: React.FC<PDFViewerProps> = ({ title, filePath, storageUrl }) => {
  const fullUrl = `${storageUrl}/${filePath}`;

  return (
    <div className="h-[800px]">
      <h4 className="font-semibold text-tibetan-brown mb-4">{title}</h4>
      <div className="h-full border rounded-lg bg-white p-4">
        <a 
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline block mb-4"
        >
          View {title} PDF
        </a>
        <object
          data={fullUrl}
          type="application/pdf"
          className="w-full h-full"
        >
          <p>Unable to display PDF. <a href={fullUrl} target="_blank" rel="noopener noreferrer">Download PDF</a> instead.</p>
        </object>
      </div>
    </div>
  );
};

export default PDFViewer;