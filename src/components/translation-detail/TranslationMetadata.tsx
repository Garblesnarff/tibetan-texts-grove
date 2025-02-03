import { Translation } from '@/types/translation';
import { ExternalLink, Calendar } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TranslationMetadataProps {
  translation: Translation;
}

export const TranslationMetadata = ({ translation }: TranslationMetadataProps) => {
  return (
    <div className="space-y-2">
      {(translation.source_author || translation.source_url) && (
        <div className="text-sm text-muted-foreground space-y-1">
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

      <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
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
    </div>
  );
};