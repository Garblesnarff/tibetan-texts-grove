import { Json } from "@/integrations/supabase/types";

/**
 * Translation interface
 * Defines the structure of a translation object
 */
export interface Translation {
  id: string;
  title: string;
  tibetan_title?: string | null;
  source_file_path?: string | null;
  translation_file_path?: string | null;
  metadata?: {
    originalFileName?: string;
    originalTibetanFileName?: string;
    [key: string]: any;
  } | Json | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
}