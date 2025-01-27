import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TranslationMetadataProps {
  viewCount: number;
  featured: boolean;
  updatedAt: string;
  tags?: string[];
}

export const TranslationMetadata = ({
  viewCount,
  featured,
  updatedAt,
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
      
      <span className="text-sm">
        Updated {formatDistanceToNow(new Date(updatedAt))} ago
      </span>
      
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