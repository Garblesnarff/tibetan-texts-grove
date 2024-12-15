import { Card } from "@/components/ui/card";

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
            <iframe
              src={`${STORAGE_URL}/${translation.source_file_path}`}
              className="w-full h-full border rounded-lg bg-white"
              title="Tibetan Source"
            />
          </div>
        )}
        
        {translation.translation_file_path && (
          <div className="h-[800px]">
            <h4 className="font-semibold text-tibetan-brown mb-4">English Translation</h4>
            <iframe
              src={`${STORAGE_URL}/${translation.translation_file_path}`}
              className="w-full h-full border rounded-lg bg-white"
              title="English Translation"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default TranslationViewer;