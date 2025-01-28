import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFPageNavigationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const PDFPageNavigation: React.FC<PDFPageNavigationProps> = ({
  currentPage,
  totalPages,
  isLoading,
  onPreviousPage,
  onNextPage,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-full shadow-sm border">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPreviousPage}
        disabled={currentPage <= 1 || isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onNextPage}
        disabled={currentPage >= totalPages || isLoading}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};