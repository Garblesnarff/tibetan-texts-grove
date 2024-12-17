import React from 'react';
import { Translation } from '@/types/translation';

interface TranslationHeaderProps {
  translation: Translation;
}

/**
 * TranslationHeader Component
 * Displays the title and Tibetan title of a translation
 * 
 * @param {Translation} translation - The translation object containing title information
 */
const TranslationHeader: React.FC<TranslationHeaderProps> = ({ translation }) => {
  const code = translation.title.split(' ')[0];

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{code} Translation</h1>
      {translation.tibetan_title && (
        <p className="text-tibetan-maroon font-tibetan text-xl mb-2">
          {translation.tibetan_title}
        </p>
      )}
    </div>
  );
};

export default TranslationHeader;