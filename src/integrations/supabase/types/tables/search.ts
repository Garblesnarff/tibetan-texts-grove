export interface SearchSuggestions {
  Row: {
    id: string;
    original_term: string;
    suggested_term: string;
    type: string;
    usage_count: number | null;
    created_at: string | null;
    updated_at: string | null;
    relevance_score: number | null;
  };
  Insert: {
    id?: string;
    original_term: string;
    suggested_term: string;
    type: string;
    usage_count?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    relevance_score?: number | null;
  };
  Update: {
    id?: string;
    original_term?: string;
    suggested_term?: string;
    type?: string;
    usage_count?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    relevance_score?: number | null;
  };
}

export interface SuggestionAnalytics {
  Row: {
    id: string;
    suggestion_id: string | null;
    action_type: string;
    user_ip: string | null;
    created_at: string | null;
  };
  Insert: {
    id?: string;
    suggestion_id?: string | null;
    action_type: string;
    user_ip?: string | null;
    created_at?: string | null;
  };
  Update: {
    id?: string;
    suggestion_id?: string | null;
    action_type?: string;
    user_ip?: string | null;
    created_at?: string | null;
  };
}