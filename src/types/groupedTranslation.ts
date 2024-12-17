import { Translation } from "./translation";

/**
 * Interface representing a group of translations sharing the same code
 * @interface GroupedTranslation
 * @property {string} code - The unique code identifier for the group
 * @property {Translation[]} translations - Array of translations in this group
 */
export interface GroupedTranslation {
  code: string;
  translations: Translation[];
}