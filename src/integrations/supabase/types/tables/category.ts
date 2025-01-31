export interface Categories {
  Row: {
    id: string;
    title: string;
    description: string | null;
    created_at: string | null;
    updated_at: string | null;
    created_by: string | null;
    translation_count?: number;
  };
  Insert: {
    id?: string;
    title: string;
    description?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    created_by?: string | null;
  };
  Update: {
    id?: string;
    title?: string;
    description?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    created_by?: string | null;
  };
}