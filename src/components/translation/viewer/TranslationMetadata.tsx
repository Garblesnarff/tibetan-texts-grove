import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Clock, Tag } from "lucide-react";
import { RelevanceScore } from "@/types/sorting";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TranslationMetadataProps {
  translation: {
    view_count: number;
    featured: boolean;
    created_at: string;
    tags?: string[];
  };
  showRelevance?: boolean;
  relevanceScore?: RelevanceScore;
}

export const TranslationMetadata = ({
  translation,
  showRelevance = false,
  relevanceScore,
}: TranslationMetadataProps) => {
  const { view_count, featured, created_at, tags = [] } = translation;
  const formattedDate = new Date(created_at).toLocaleDateString();
  const visibleTags = tags.slice(0, 5);
  const remainingTags = tags.slice(5);
  const hasMoreTags = remainingTags.length > 0;

  return (
    <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
      {showRelevance && relevanceScore && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {relevanceScore.total.toFixed(2)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="w-64">
            <div className="space-y-1">
              <p>Relevance Score Breakdown:</p>
              <div className="text-xs">
                <div>Title Match: {relevanceScore.titleMatch.toFixed(2)}</div>
                <div>Tag Match: {relevanceScore.tagMatch.toFixed(2)}</div>
                <div>Recency: {relevanceScore.recency.toFixed(2)}</div>
                <div>Views: {relevanceScore.viewCount.toFixed(2)}</div>
                <div>Featured: {relevanceScore.featured.toFixed(2)}</div>
                <div>Category: {relevanceScore.categoryMatch.toFixed(2)}</div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      )}

      <div className="flex items-center">
        <Eye className="h-4 w-4 mr-1" />
        {view_count} views
      </div>

      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        {formattedDate}
      </div>

      {featured && (
        <Badge variant="secondary" className="flex items-center">
          <Star className="h-3 w-3 mr-1 fill-current" />
          Featured
        </Badge>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {visibleTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="flex items-center gap-1 bg-tibetan-maroon/10 text-tibetan-maroon border-tibetan-maroon/20 hover:bg-tibetan-maroon/20"
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
                  className="flex items-center gap-1 cursor-help bg-tibetan-maroon/10 text-tibetan-maroon border-tibetan-maroon/20 hover:bg-tibetan-maroon/20"
                >
                  +{remainingTags.length} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="w-64">
                <div className="space-y-1">
                  <p className="font-medium">Additional tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {remainingTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-tibetan-maroon/10 text-tibetan-maroon border-tibetan-maroon/20"
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