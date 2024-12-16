import { ScrollArea } from "@/components/ui/scroll-area";

interface PDFTextViewerProps {
  title: string;
  content: string;
  isTibetan?: boolean;
}

/**
 * PDFTextViewer Component
 * Displays text content from a PDF in a scrollable area
 * 
 * @param {string} title - The title to display above the content
 * @param {string} content - The text content to display
 * @param {boolean} isTibetan - Whether the content is in Tibetan script
 */
export function PDFTextViewer({ title, content, isTibetan = false }: PDFTextViewerProps) {
  return (
    <div className="h-[800px]">
      <h4 className="font-semibold text-tibetan-brown mb-4">{title}</h4>
      <ScrollArea className="h-full border rounded-lg bg-white p-4">
        <div className={`text-lg whitespace-pre-wrap ${isTibetan ? 'font-tibetan' : ''}`}>
          {content}
        </div>
      </ScrollArea>
    </div>
  );
}