import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, ArrowUpDown, ChevronRight, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

type SortOption = "name" | "count" | "updated";

export default function Categories() {
  const { categories, loading, error, fetchCategories } = useCategories();
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        await fetchCategories();
      } catch (err: any) {
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Error loading categories",
            description: err.message
          });
        }
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const sortedCategories = [...(categories || [])].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title);
      case "count":
        return (b.translation_count || 0) - (a.translation_count || 0);
      case "updated":
        return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
      default:
        return 0;
    }
  });

  const totalTranslations = categories?.reduce(
    (sum, category) => sum + (category.translation_count || 0),
    0
  ) || 0;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-tibetan-maroon mb-4" />
        <h2 className="text-2xl font-serif text-tibetan-maroon mb-2">
          Unable to load categories
        </h2>
        <p className="text-muted-foreground mb-4">
          There was an error loading the categories. Please try again.
        </p>
        <Button 
          onClick={() => fetchCategories()}
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center hover:text-tibetan-maroon">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Categories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif text-tibetan-maroon">
              Categories
            </h1>
            <p className="text-muted-foreground">
              Browse {categories?.length || 0} categories containing {totalTranslations} translations
            </p>
          </div>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="count">Sort by Count</SelectItem>
              <SelectItem value="updated">Sort by Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        role="list"
        aria-label="Categories"
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))
        ) : sortedCategories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No categories found</p>
          </div>
        ) : (
          sortedCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))
        )}
      </div>
    </div>
  );
}
