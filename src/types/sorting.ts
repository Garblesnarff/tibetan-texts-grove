export type SortOption = {
  label: string;
  value: string;
  icon?: React.ComponentType;
};

export type SortDirection = 'asc' | 'desc';

export type SortConfig = {
  field: string;
  direction: SortDirection;
};