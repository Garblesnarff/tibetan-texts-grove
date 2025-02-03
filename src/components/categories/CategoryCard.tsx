import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Category } from "@/types/category";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Book, Folder } from "lucide-react";

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
        "block transition-all duration-300 ease-in-out",
        "hover:scale-[1.02] focus-visible:scale-[1.02]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-tibetan-maroon rounded-lg",
        "group", // Add group for hover effects
        className
      )}
    >
      <Card className={cn(
        "h-full border-tibetan-brown/20",
        "bg-gradient-to-br from-white to-tibetan-gold/5",
        "backdrop-blur-sm shadow-md",
        "group-hover:shadow-lg transition-shadow duration-300",
        "group-hover:border-tibetan-gold/30"
      )}>
        <CardHeader className="relative space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Folder 
                  className="w-5 h-5 text-tibetan-maroon/70 group-hover:text-tibetan-maroon transition-colors" 
                  aria-hidden="true"
                />
                <h3 className="font-serif text-xl text-tibetan-maroon group-hover:text-tibetan-maroon/80 transition-colors">
                  {category.title}
                </h3>
              </div>
              {category.tibetan_title && (
                <p className="font-tibetan text-lg text-tibetan-brown/80 group-hover:text-tibetan-brown transition-colors">
                  {category.tibetan_title}
                </p>
              )}
            </div>
            <Badge 
              variant="secondary"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1",
                "bg-tibetan-gold/10 text-tibetan-brown",
                "group-hover:bg-tibetan-gold/20 transition-colors"
              )}
            >
              <Book className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{category.translation_count || 0}</span>
            </Badge>
          </div>
          {isRecent && (
            <Badge 
              className={cn(
                "absolute -top-2 -right-2",
                "bg-tibetan-maroon text-white",
                "animate-pulse"
              )}
              aria-label="Recently updated"
            >
              New
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {category.description && (
            <p className={cn(
              "text-sm text-muted-foreground/90",
              "line-clamp-2 group-hover:text-muted-foreground",
              "transition-colors"
            )}>
              {category.description}
            </p>
          )}
          {category.updated_at && (
            <p className={cn(
              "text-xs text-muted-foreground/70",
              "group-hover:text-muted-foreground/90",
              "transition-colors flex items-center gap-1"
            )}>
              Updated {formatDistanceToNow(new Date(category.updated_at))} ago
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}