import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Clock } from "lucide-react";
import { RelevanceScore } from "@/types/sorting";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TranslationMetadataProps {
  viewCount: number;
  featured: boolean;
  createdAt: string;
  relevanceScore?: RelevanceScore;
  showRelevance?: boolean;
}

export const TranslationMetadata = ({
  viewCount,
  featured,
  createdAt,
  relevanceScore,
  showRelevance = false,
}: TranslationMetadataProps) => {
  const formattedDate = new Date(createdAt).toLocaleDateString();
  
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
        {viewCount} views
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
    </div>
  );
};