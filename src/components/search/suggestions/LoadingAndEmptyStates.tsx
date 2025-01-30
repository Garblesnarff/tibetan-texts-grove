interface LoadingAndEmptyStatesProps {
  isLoading: boolean;
  hasError: boolean;
  hasQuery: boolean;
  suggestionsCount: number;
}

export function LoadingAndEmptyStates({ 
  isLoading, 
  hasError, 
  hasQuery, 
  suggestionsCount 
}: LoadingAndEmptyStatesProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
        Loading suggestions...
      </div>
    );
  }

  if (!isLoading && !hasError && hasQuery && suggestionsCount === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          No suggestions found
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Try a different search term
        </p>
      </div>
    );
  }

  return null;
}