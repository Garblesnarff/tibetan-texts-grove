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
  viewCount?: number;
  featured?: boolean;
  updatedAt?: string;
  createdAt?: string;
  tags?: string[];
}

export const CardViewMode = ({
  englishTitle,
  tibetanTitle,
  originalTibetanFileName,
  searchQuery,
  viewCount = 0,
  featured = false,
  updatedAt = new Date().toISOString(),
  createdAt = new Date().toISOString(),
  tags = [],
}: CardViewModeProps) => {
  const visibleTags = tags.slice(0, 5);
  const remainingTags = tags.slice(5);
  const hasMoreTags = remainingTags.length > 0;

  return (
    <div className="space-y-2">
      <div>
        {englishTitle && (
          <h3 className="text-lg font-semibold leading-tight">
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
          <p className="tibetan-text mt-1 text-muted-foreground">
            {tibetanTitle}
          </p>
        )}
        {originalTibetanFileName && (
          <p className="text-sm text-muted-foreground mt-1">
            {originalTibetanFileName}
          </p>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visibleTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="flex items-center gap-1 text-xs"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
          {hasMoreTags && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-xs cursor-help"
                >
                  +{remainingTags.length} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px]">
                <div className="flex flex-wrap gap-1">
                  {remainingTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
};