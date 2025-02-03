import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Category } from "@/types/category";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const isRecent = category.updated_at && 
    new Date(category.updated_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <Link 
      to={`/category/${category.id}`}
      className={cn(
        "block transition-all duration-200",
        "hover:scale-[1.02] focus-visible:scale-[1.02]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-tibetan-maroon rounded-lg",
        className
      )}
    >
      <Card className="h-full border-tibetan-brown/20 bg-background/50 backdrop-blur-sm">
        <CardHeader className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif text-xl text-tibetan-maroon">
                {category.title}
              </h3>
              {category.tibetan_title && (
                <p className="font-tibetan text-lg text-tibetan-brown/80">
                  {category.tibetan_title}
                </p>
              )}
            </div>
            <Badge 
              variant="secondary"
              className="bg-tibetan-gold/10 hover:bg-tibetan-gold/20"
            >
              {category.translation_count || 0}
            </Badge>
          </div>
          {isRecent && (
            <Badge 
              className="absolute -top-2 -right-2 bg-tibetan-maroon"
              aria-label="Recently updated"
            >
              New
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {category.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          )}
          {category.updated_at && (
            <p className="text-xs text-muted-foreground">
              Updated {formatDistanceToNow(new Date(category.updated_at))} ago
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}