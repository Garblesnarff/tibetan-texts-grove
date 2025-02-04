import { Translation } from "./translation";

/**
 * @deprecated Use Translation type directly instead as we no longer group translations
 */
export interface GroupedTranslation {
  code: string;
  translations: Translation[];
  featured?: boolean;
  created_at?: string;
  view_count?: number;
}