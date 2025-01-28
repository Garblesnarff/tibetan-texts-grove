import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Calendar } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Tooltip } from "@/components/ui/tooltip";

interface TranslationMetadataProps {
  viewCount: number;
  featured: boolean;
  updatedAt: string;
  createdAt: string;
  tags?: string[];
}

export const TranslationMetadata = ({
  viewCount,
  featured,
  updatedAt,
  createdAt,
  tags = [],
}: TranslationMetadataProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
      <div className="flex items-center">
        <Eye className="h-4 w-4 mr-1" />
        {viewCount} views
      </div>
      
      {featured && (
        <Badge variant="secondary" className="flex items-center">
          <Star className="h-3 w-3 mr-1 fill-current" />
          Featured
        </Badge>
      )}
      
      <Tooltip>
        <Tooltip.Trigger asChild>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Updated {formatDistanceToNow(new Date(updatedAt))} ago
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>Created: {format(new Date(createdAt), 'PPP')}</p>
          <p>Last updated: {format(new Date(updatedAt), 'PPP')}</p>
        </Tooltip.Content>
      </Tooltip>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};