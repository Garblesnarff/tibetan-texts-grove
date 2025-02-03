import React from 'react';
import { Translation } from '@/types/translation';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TranslationMetadata } from './TranslationMetadata';

interface TranslationHeaderProps {
  translation?: Translation;
  isLoading?: boolean;
}

const TranslationHeader: React.FC<TranslationHeaderProps> = ({ 
  translation,
  isLoading = false 
}) => {
  // Debug logs
  console.log('Translation:', translation);
  console.log('Translation title:', translation?.title);
  console.log('Translation tibetan title:', translation?.tibetan_title);

  if (isLoading || !translation) {
    return (
      <div className="space-y-4 mb-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">{translation.title}</h1>
        {translation.tibetan_title && (
          <p className="text-tibetan-maroon font-tibetan text-xl mb-2">
            {translation.tibetan_title}
          </p>
        )}
      </div>
      
      <TranslationMetadata translation={translation} />

      {translation.description && (
        <p className="text-muted-foreground mt-2">
          {translation.description}
        </p>
      )}
    </div>
  );
};

export default TranslationHeader;