import { Json } from "../shared/json";

export interface Translations {
  Row: {
    id: string;
    title: string;
    tibetan_title: string | null;
    source_file_path: string | null;
    translation_file_path: string | null;
    metadata: Json | null;
    created_at: string | null;
    updated_at: string | null;
    created_by: string | null;
    category_id: string | null;
    description: string | null;
    search_vector: unknown;
    tags: string[] | null;
    view_count: number | null;
    featured: boolean | null;
    source_author: string | null;
    source_url: string | null;
    relevance_score: number | null;
  };
  Insert: {
    id?: string;
    title: string;
    tibetan_title?: string | null;
    source_file_path?: string | null;
    translation_file_path?: string | null;
    metadata?: Json | null;
    created_at?: string | null;
    updated_at?: string | null;
    created_by?: string | null;
    category_id?: string | null;
    description?: string | null;
    search_vector?: unknown;
    tags?: string[] | null;
    view_count?: number | null;
    featured?: boolean | null;
    source_author?: string | null;
    source_url?: string | null;
    relevance_score?: number | null;
  };
  Update: {
    id?: string;
    title?: string;
    tibetan_title?: string | null;
    source_file_path?: string | null;
    translation_file_path?: string | null;
    metadata?: Json | null;
    created_at?: string | null;
    updated_at?: string | null;
    created_by?: string | null;
    category_id?: string | null;
    description?: string | null;
    search_vector?: unknown;
    tags?: string[] | null;
    view_count?: number | null;
    featured?: boolean | null;
    source_author?: string | null;
    source_url?: string | null;
    relevance_score?: number | null;
  };
}