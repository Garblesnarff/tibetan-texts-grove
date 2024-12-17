import { Translation } from "@/types/translation";
import { GroupedTranslation } from "@/types/groupedTranslation";

/**
 * Groups translations by their code (first word of the title)
 * @param {Translation[]} data - Array of translations to be grouped
 * @returns {GroupedTranslation[]} Array of grouped translations
 */
export const groupTranslations = (data: Translation[]): GroupedTranslation[] => {
  const groups: { [key: string]: Translation[] } = {};
  
  data.forEach(translation => {
    const code = translation.title.split(' ')[0];
    if (!groups[code]) {
      groups[code] = [];
    }
    groups[code].push(translation);
  });

  return Object.entries(groups).map(([code, translations]) => ({
    code,
    translations
  }));
};