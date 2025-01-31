export interface SearchSuggestions {
  Row: {
    id: string;
    original_term: string;
    suggested_term: string;
    type: string;
    usage_count: number;
    created_at: string;
    updated_at: string;
    relevance_score: number;
  };
  Insert: {
    id?: string;
    original_term: string;
    suggested_term: string;
    type: string;
    usage_count?: number;
    created_at?: string;
    updated_at?: string;
    relevance_score?: number;
  };
  Update: {
    id?: string;
    original_term?: string;
    suggested_term?: string;
    type?: string;
    usage_count?: number;
    created_at?: string;
    updated_at?: string;
    relevance_score?: number;
  };
}

export interface SuggestionAnalytics {
  Row: {
    id: string;
    suggestion_id: string;
    action_type: string;
    user_ip: string | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    suggestion_id: string;
    action_type: string;
    user_ip?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    suggestion_id?: string;
    action_type?: string;
    user_ip?: string | null;
    created_at?: string;
  };
}