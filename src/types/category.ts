export interface Category {
  id: string;
  title: string;
  tibetan_title?: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  translation_count?: number;
}