import { Translation } from "./translation";

/**
 * Interface representing a group of translations sharing the same code
 * @interface GroupedTranslation
 * @property {string} code - The unique code identifier for the group
 * @property {Translation[]} translations - Array of translations in this group
 * @property {boolean} featured - Whether this group is featured
 * @property {string} created_at - Creation timestamp
 * @property {number} view_count - Number of views
 */
export interface GroupedTranslation {
  code: string;
  translations: Translation[];
  featured?: boolean;
  created_at?: string;
  view_count?: number;
}