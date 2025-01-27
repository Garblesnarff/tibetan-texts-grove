interface EmptyStateProps {
  isSearching?: boolean;
  searchQuery?: string;
}

export const EmptyState = ({ isSearching, searchQuery }: EmptyStateProps) => {
  if (isSearching && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center">
        <p className="text-lg text-muted-foreground">
          No translations found for "{searchQuery}"
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search terms or browse all translations
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[200px]">
      <p className="text-muted-foreground">No translations available</p>
    </div>
  );
};