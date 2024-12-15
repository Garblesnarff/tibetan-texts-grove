import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  useEffect(() => {
    const fetchPDFText = async (filePath: string) => {
      try {
        const response = await fetch(`${STORAGE_URL}/${filePath}`);
        const text = await response.text();
        return text;
      } catch (error) {
        console.error("Error fetching PDF text:", error);
        return "";
      }
    };

    if (translation.source_file_path) {
      fetchPDFText(translation.source_file_path).then(setSourceText);
    }
    if (translation.translation_file_path) {
      fetchPDFText(translation.translation_file_path).then(setTranslationText);
    }
  }, [translation]);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{translation.title.split('_')[0]}</h3>
        {translation.tibetan_title && (
          <p className="text-tibetan-maroon font-tibetan text-xl">{translation.tibetan_title}</p>
        )}
      </div>
      
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
    </Card>
  );
};

export default TranslationViewer;