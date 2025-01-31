import { Categories, Translations, TranslationViews, SearchSuggestions, SuggestionAnalytics } from './tables';

export interface Database {
  public: {
    Tables: {
      categories: Categories;
      translations: Translations;
      translation_views: TranslationViews;
      search_suggestions: SearchSuggestions;
      suggestion_analytics: SuggestionAnalytics;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}