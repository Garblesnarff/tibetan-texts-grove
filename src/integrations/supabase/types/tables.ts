import { Json } from "./json";

export interface Tables {
  categories: {
    Row: {
      created_at: string | null;
      created_by: string | null;
      description: string | null;
      id: string;
      title: string;
      updated_at: string | null;
    };
    Insert: {
      created_at?: string | null;
      created_by?: string | null;
      description?: string | null;
      id?: string;
      title: string;
      updated_at?: string | null;
    };
    Update: {
      created_at?: string | null;
      created_by?: string | null;
      description?: string | null;
      id?: string;
      title?: string;
      updated_at?: string | null;
    };
  };
  translations: {
    Row: {
      category_id: string | null;
      created_at: string | null;
      created_by: string | null;
      id: string;
      metadata: Json | null;
      source_file_path: string | null;
      tibetan_title: string | null;
      title: string;
      translation_file_path: string | null;
      updated_at: string | null;
    };
    Insert: {
      category_id?: string | null;
      created_at?: string | null;
      created_by?: string | null;
      id?: string;
      metadata?: Json | null;
      source_file_path?: string | null;
      tibetan_title?: string | null;
      title: string;
      translation_file_path?: string | null;
      updated_at?: string | null;
    };
    Update: {
      category_id?: string | null;
      created_at?: string | null;
      created_by?: string | null;
      id?: string;
      metadata?: Json | null;
      source_file_path?: string | null;
      tibetan_title?: string | null;
      title?: string;
      translation_file_path?: string | null;
      updated_at?: string | null;
    };
  };
}