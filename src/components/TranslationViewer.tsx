import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Initialize PDF.js worker
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const STORAGE_URL = "https://cnalyhtalikwsopogula.supabase.co/storage/v1/object/public/admin_translations";

interface TranslationViewerProps {
  translation: {
    title: string;
    tibetan_title: string | null;
    source_file_path: string | null;
    translation_file_path: string | null;
  };
}

const TranslationViewer = ({ translation }: TranslationViewerProps) => {
  const [sourceText, setSourceText] = useState<string>("");
  const [translationText, setTranslationText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const extractTextFromPDF = async (filePath: string) => {
      try {
        // Fetch the PDF as ArrayBuffer
        const response = await fetch(`${STORAGE_URL}/${filePath}`);
        const arrayBuffer = await response.arrayBuffer();

        // Load the PDF document
        const loadingTask = getDocument({ data: arrayBuffer });
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
        return "Error loading PDF text";
      }
    };

    const loadPDFs = async () => {
      setIsLoading(true);
      try {
        if (translation.source_file_path) {
          const sourceText = await extractTextFromPDF(translation.source_file_path);
          setSourceText(sourceText);
        }
        if (translation.translation_file_path) {
          const translationText = await extractTextFromPDF(translation.translation_file_path);
          setTranslationText(translationText);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPDFs();
  }, [translation]);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{translation.title.split('_')[0]}</h3>
        {translation.tibetan_title && (
          <p className="text-tibetan-maroon font-tibetan text-xl">{translation.tibetan_title}</p>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <p>Loading PDF content...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {translation.source_file_path && (
            <div className="h-[800px]">
              <h4 className="font-semibold text-tibetan-brown mb-4">Tibetan Source</h4>
              <ScrollArea className="h-full border rounded-lg bg-white p-4">
                <div className="font-tibetan text-lg whitespace-pre-wrap">
                  {sourceText}
                </div>
              </ScrollArea>
            </div>
          )}
          
          {translation.translation_file_path && (
            <div className="h-[800px]">
              <h4 className="font-semibold text-tibetan-brown mb-4">English Translation</h4>
              <ScrollArea className="h-full border rounded-lg bg-white p-4">
                <div className="text-lg whitespace-pre-wrap">
                  {translationText}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default TranslationViewer;