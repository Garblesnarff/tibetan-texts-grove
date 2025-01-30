import { Translation } from "@/types/translation";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, EyeIcon, StarIcon, TrendingUpIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TranslationMetadataProps {
  translation: Translation;
  showRelevance?: boolean;
}

export const TranslationMetadata = ({ 
  translation,
  showRelevance = false
}: TranslationMetadataProps) => {
  const { view_count, featured, created_at, updated_at, tags = [] } = translation;

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center text-sm text-muted-foreground">
      {showRelevance && translation.relevance_score && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUpIcon className="w-3 h-3" />
                Score: {translation.relevance_score.toFixed(2)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Relevance score based on:</p>
              <ul className="text-xs mt-1">
                <li>• Title match</li>
                <li>• Tag relevance</li>
                <li>• Content recency</li>
                <li>• View count</li>
                <li>• Featured status</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <Badge variant="secondary" className="flex items-center gap-1">
        <EyeIcon className="w-3 h-3" />
        {view_count} views
      </Badge>
      
      {featured && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <StarIcon className="w-3 h-3" />
          Featured
        </Badge>
      )}
      
      <Badge variant="secondary" className="flex items-center gap-1">
        <CalendarIcon className="w-3 h-3" />
        {format(new Date(created_at), 'MMM d, yyyy')}
      </Badge>
      
      {tags.map((tag) => (
        <Badge key={tag} variant="outline">
          {tag}
        </Badge>
      ))}
    </div>
  );
};