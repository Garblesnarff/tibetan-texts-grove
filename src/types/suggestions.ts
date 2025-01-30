export interface SuggestionScore {
  categoryMatchScore: number;
  tagSimilarityScore: number;
  viewCountScore: number;
  historicalUsageScore: number;
  totalScore: number;
}

export interface SearchSuggestion {
  id: string;
  original_term: string;
  suggested_term: string;
  type: 'correction' | 'related';
  usage_count: number;
  relevance_score: number;
  created_at: string;
  updated_at: string;
  category_id?: string | null;
  category_title?: string;
  tag_similarity?: number;
  view_count_proximity?: number;
}

export interface SuggestionAnalytics {
  id: string;
  suggestion_id: string;
  action_type: string;
  created_at: string;
}