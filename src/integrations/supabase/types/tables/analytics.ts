export interface TranslationViews {
  Row: {
    id: string;
    translation_id: string;
    viewer_ip: string;
    viewed_at: string | null;
  };
  Insert: {
    id?: string;
    translation_id: string;
    viewer_ip: string;
    viewed_at?: string | null;
  };
  Update: {
    id?: string;
    translation_id?: string;
    viewer_ip?: string;
    viewed_at?: string | null;
  };
}