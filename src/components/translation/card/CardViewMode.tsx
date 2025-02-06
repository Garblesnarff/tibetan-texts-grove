import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { highlightText } from "@/utils/highlightText";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CardViewModeProps {
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
  searchQuery?: string;
  tags?: string[];
  view_count?: number;
  featured?: boolean;
  updated_at?: string;
  created_at?: string;
}

export const CardViewMode = ({
  englishTitle,
  tibetanTitle,
  originalTibetanFileName,
  searchQuery,
  tags = [],
}: CardViewModeProps) => {
  const visibleTags = tags.slice(0, 5);
  const remainingTags = tags.slice(5);
  const hasMoreTags = remainingTags.length > 0;

  return (
    <div className="space-y-4 w-full">
      <div className="min-w-0 flex-1">
        {englishTitle && (
          <h3 className="text-lg font-semibold leading-tight break-words">
            {searchQuery ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: highlightText(englishTitle, searchQuery),
                }}
              />
            ) : (
              englishTitle
            )}
          </h3>
        )}
        {tibetanTitle && (
          <p className="tibetan-text mt-3 text-tibetan-maroon break-words">
            {tibetanTitle}
          </p>
        )}
        {originalTibetanFileName && (
          <p className="text-sm text-muted-foreground mt-2 break-words">
            {originalTibetanFileName}
          </p>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 min-w-0 w-full">
          {visibleTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="inline-flex items-center gap-1 text-xs px-2 py-1 whitespace-nowrap bg-tibetan-maroon/10 text-tibetan-maroon border-tibetan-maroon/20 hover:bg-tibetan-maroon/20 transition-colors duration-200 hover:scale-105 transform"
            >
              <Tag className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[150px]">{tag}</span>
            </Badge>
          ))}
          {hasMoreTags && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 cursor-help bg-tibetan-maroon/10 text-tibetan-maroon border-tibetan-maroon/20 hover:bg-tibetan-maroon/20 transition-colors duration-200 hover:scale-105 transform"
                >
                  +{remainingTags.length} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="w-64 p-2">
                <div className="space-y-1">
                  <p className="font-medium">Additional tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {remainingTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs bg-tibetan-maroon/10 text-tibetan-maroon border-tibetan-maroon/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
};