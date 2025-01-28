import { Json } from "@/integrations/supabase/types/json";

export interface Translation {
  id: string;
  title: string;
  tibetan_title?: string | null;
  source_file_path?: string | null;
  translation_file_path?: string | null;
  metadata?: TranslationMetadata | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  category_id?: string | null;
  description?: string | null;
  tags?: string[] | null;
  view_count?: number;
  featured?: boolean;
  search_vector?: unknown;
  source_author?: string | null;
  source_url?: string | null;
}

export interface TranslationMetadata {
  featured?: boolean;
  view_count?: number;
  originalFileName?: string;
  originalTibetanFileName?: string;
  [key: string]: any;
}

export const parseTranslation = (data: any): Translation => {
  return {
    ...data,
    metadata: typeof data.metadata === 'string' 
      ? JSON.parse(data.metadata) 
      : data.metadata
  };
};