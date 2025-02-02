import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslations } from "@/hooks/useTranslations";
import { TranslationsGrid } from "@/components/index/TranslationsGrid";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchControls } from "@/components/search/SearchControls";
import { ActiveFilters } from "@/components/filtering/ActiveFilters";
import { SortConfig } from "@/types/sorting";
import { Header } from "@/components/index/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSort, setCurrentSort] = useState<string>("created_at:desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<{ tag: string; count: number; }[]>([]);

  console.log('CategoryPage: Current category ID from URL:', id);

  const {
    translations,
    loading: isLoading,
    error,
    handleDelete,
    fetchTranslations
  } = useTranslations({
    category_id: id
  });

  // Fetch category title
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        console.log('Fetching category details for ID:', id);
        if (!id) {
          console.error('No category ID provided');
          return;
        }

        const { data, error } = await supabase
          .from('categories')
          .select('title')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching category:', error);
          throw error;
        }
        
        if (data) {
          console.log('Category data:', data);
          setCategoryTitle(data.title);
        } else {
          console.log('No category found with ID:', id);
          toast({
            variant: "destructive",
            title: "Category not found",
            description: "The requested category could not be found."
          });
        }
      } catch (err: any) {
        console.error('Error fetching category:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load category details"
        });
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, toast]);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        console.log('Fetching tags for category:', id);
        const { data, error } = await supabase
          .from('translations')
          .select('tags')
          .eq('category_id', id)
          .not('tags', 'eq', '{}');

        if (error) throw error;

        const tagCounts: { [key: string]: number } = {};
        data?.forEach(translation => {
          if (translation.tags) {
            translation.tags.forEach((tag: string) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });

        const formattedTags = Object.entries(tagCounts).map(([tag, count]) => ({
          tag,
          count
        }));

        console.log('Available tags:', formattedTags);
        setAvailableTags(formattedTags);
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };

    if (id) {
      fetchTags();
    }
  }, [id]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSortChange = (sortConfig: SortConfig) => {
    setCurrentSort(`${sortConfig.field}:${sortConfig.direction}`);
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleClearAll = () => {
    setSelectedTags([]);
  };

  if (error) {
    console.error('Error in CategoryPage:', error);
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading translations: {error.message}</p>
      </div>
    );
  }

  console.log('CategoryPage: Rendering with translations:', translations);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <h1 className="text-2xl font-bold mb-6">{categoryTitle}</h1>
      
      <div className="space-y-4">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
        />
        
        <SearchControls
          availableTags={availableTags}
          selectedTags={selectedTags}
          selectedCategory={id || null}
          startDate={null}
          endDate={null}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
          onCategoryChange={() => {}}
          onDateChange={() => {}}
          onSortChange={handleSortChange}
          currentSort={currentSort}
        />
        
        <ActiveFilters
          selectedTags={selectedTags}
          selectedCategory={id || null}
          startDate={null}
          endDate={null}
          resultCount={translations.length}
          onClearTag={handleTagRemove}
          onClearCategory={() => {}}
          onClearDates={() => {}}
          onClearAll={handleClearAll}
        />

        <TranslationsGrid
          translations={translations}
          onDelete={handleDelete}
          isLoading={isLoading}
          searchQuery={searchQuery}
          activeCategory={categoryTitle}
        />
      </div>
    </div>
  );
}