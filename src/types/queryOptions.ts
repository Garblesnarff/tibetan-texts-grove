export interface TranslationQueryOptions {
  featured?: boolean;
  sortBy?: string;
  limit?: number;
  categoryId?: string;
  searchQuery?: string;
}

export interface SectionQueryOptions extends TranslationQueryOptions {
  sectionType: 'featured' | 'recent' | 'popular';
}