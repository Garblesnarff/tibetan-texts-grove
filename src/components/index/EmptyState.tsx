interface EmptyStateProps {
  isSearching?: boolean;
  searchQuery?: string;
  activeCategory?: string;
}

export const EmptyState = ({ isSearching, searchQuery, activeCategory }: EmptyStateProps) => {
  if (isSearching && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center px-4">
        <p className="text-lg md:text-xl text-muted-foreground">
          No translations found for "{searchQuery}"
          {activeCategory && ` in category "${activeCategory}"`}
        </p>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Try adjusting your search terms or browse all translations
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[200px] px-4">
      <p className="text-base md:text-lg text-muted-foreground text-center">
        No translations available
      </p>
    </div>
  );
};