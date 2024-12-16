import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { PDFTextViewer } from "./PDFTextViewer";
import { extractTextFromPDF } from "./PDFExtractor";
import { Translation } from "@/types/translation";

const STORAGE_URL = "https://cnalyhtalikwsopogula.supabase.co/storage/v1/object/public/admin_translations";

interface TranslationViewerProps {
  translation: Translation;
}

/**
 * TranslationViewer Component
 * Displays a Tibetan text and its English translation from PDF files in a side-by-side view
 * 
 * @param {Translation} translation - The translation object containing file paths and metadata
 */
const TranslationViewer = ({ translation }: TranslationViewerProps) => {
  const [sourceText, setSourceText] = useState("");
  const [translationText, setTranslationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    /**
     * Loads and processes both source and translation PDFs
     */
    const loadPDFs = async () => {
      setIsLoading(true);
      try {
        if (translation.source_file_path) {
          const text = await extractTextFromPDF(`${STORAGE_URL}/${translation.source_file_path}`);
          setSourceText(text);
        }
        if (translation.translation_file_path) {
          const text = await extractTextFromPDF(`${STORAGE_URL}/${translation.translation_file_path}`);
          setTranslationText(text);
        }
      } catch (error) {
        console.error("Error loading PDFs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPDFs();
  }, [translation]);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{translation.title}</h3>
        {translation.tibetan_title && (
          <p className="text-tibetan-maroon font-tibetan text-xl">
            {translation.tibetan_title}
          </p>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <p>Loading PDF content...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {translation.source_file_path && (
            <PDFTextViewer
              title="Tibetan Source"
              content={sourceText}
              isTibetan={true}
            />
          )}
          
          {translation.translation_file_path && (
            <PDFTextViewer
              title="English Translation"
              content={translationText}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default TranslationViewer;