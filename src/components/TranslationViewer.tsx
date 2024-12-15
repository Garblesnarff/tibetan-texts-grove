import { Card } from "@/components/ui/card";

/**
 * TranslationViewer Component
 * Displays a Tibetan text and its English translation side by side
 * @param {Object} translation - Contains the translation data including title and text
 */
const TranslationViewer = ({ translation }: { translation: any }) => {
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
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-tibetan-brown">Source Text & Translation</h4>
            <div className="border rounded-lg p-4 bg-white">
              <div className="mb-4">
                <p className="font-tibetan text-lg">{translation.sourceText}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-lg">{translation.translatedText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TranslationViewer;