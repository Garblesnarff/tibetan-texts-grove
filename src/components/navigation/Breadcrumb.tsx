import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Categories } from "@/integrations/supabase/types/tables";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function CategoryBreadcrumb() {
  const { categoryId } = useParams();
  const [categoryTitle, setCategoryTitle] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        const { data, error } = await supabase
          .from('categories')
          .select('title')
          .eq('id', categoryId)
          .single();

        if (!error && data) {
          setCategoryTitle(data.title);
        }
      }
    };

    fetchCategory();
  }, [categoryId]);

  return (
    <Breadcrumb className="mb-6">
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
          <BreadcrumbLink asChild>
            <Link to="/" className="hover:text-tibetan-maroon">
              Categories
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {categoryTitle && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{categoryTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}