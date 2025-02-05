import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Clock } from "lucide-react";
import { RelevanceScore } from "@/types/sorting";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TranslationMetadataProps {
  viewCount: number;
  featured: boolean;
  updatedAt: string;
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
    <div className="flex flex-wrap gap-3 items-center text-sm text-tibetan-brown/80 mt-4 pt-4 border-t border-tibetan-brown/10">
      {showRelevance && relevanceScore && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="group-hover:bg-tibetan-gold/20 transition-colors duration-200 flex items-center gap-1">
              <Star className="h-3 w-3 fill-tibetan-gold" />
              {relevanceScore.total.toFixed(2)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="w-64">
            <div className="space-y-1">
              <p className="font-medium text-tibetan-maroon">Relevance Score Breakdown:</p>
              <div className="text-xs space-y-1 text-tibetan-brown">
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
      
      <div className="flex items-center group-hover:text-tibetan-maroon transition-colors duration-200">
        <Eye className="h-4 w-4 mr-1.5" />
        {viewCount} views
      </div>
      
      <div className="flex items-center group-hover:text-tibetan-maroon transition-colors duration-200">
        <Clock className="h-4 w-4 mr-1.5" />
        {formattedDate}
      </div>
      
      {featured && (
        <Badge 
          variant="secondary" 
          className="group-hover:bg-tibetan-gold/20 transition-colors duration-200 flex items-center"
        >
          <Star className="h-3 w-3 mr-1 fill-tibetan-gold" />
          Featured
        </Badge>
      )}
    </div>
  );
};