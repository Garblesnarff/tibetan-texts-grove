import React from 'react';
import { Translation } from '@/types/translation';
import { TranslationMetadata } from '@/components/translation/TranslationMetadata';
import { ExternalLink, Calendar } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TranslationHeaderProps {
  translation: Translation;
}

const TranslationHeader: React.FC<TranslationHeaderProps> = ({ translation }) => {
  const code = translation.title.split(' ')[0];

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{code} Translation</h1>
      {translation.tibetan_title && (
        <p className="text-tibetan-maroon font-tibetan text-xl mb-2">
          {translation.tibetan_title}
        </p>
      )}
      
      {(translation.source_author || translation.source_url) && (
        <div className="text-sm text-muted-foreground mb-3 space-y-1">
          {translation.source_author && (
            <p>Source: {translation.source_author}</p>
          )}
          {translation.source_url && (
            <a 
              href={translation.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary w-fit"
            >
              View original source <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {translation.updated_at && (
                  <span>
                    Updated {formatDistanceToNow(new Date(translation.updated_at))} ago
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {translation.created_at && (
                <p>Created: {format(new Date(translation.created_at), 'PPP')}</p>
              )}
              {translation.updated_at && (
                <p>Last updated: {format(new Date(translation.updated_at), 'PPP')}</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <TranslationMetadata
        viewCount={translation.view_count || 0}
        featured={translation.featured || false}
        updatedAt={translation.updated_at || ''}
        createdAt={translation.created_at || ''}
        tags={translation.tags || []}
      />
    </div>
  );
};

export default TranslationHeader;