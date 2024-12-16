/**
 * Translation interface
 * Defines the structure of a translation object
 */
export interface Translation {
  id: string;
  title: string;
  tibetan_title?: string;
  source_file_path?: string;
  translation_file_path?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}