import React from 'react';
import { Translation } from '@/types/translation';
import { TranslationMetadata } from '@/components/translation/TranslationMetadata';
import { ExternalLink } from 'lucide-react';

interface TranslationHeaderProps {
  translation: Translation;
}

/**
 * TranslationHeader Component
 * Displays the title, Tibetan title, and metadata of a translation
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
      
      {(translation.source_author || translation.source_url) && (
        <div className="text-sm text-muted-foreground mb-3">
          {translation.source_author && (
            <p className="mb-1">Source: {translation.source_author}</p>
          )}
          {translation.source_url && (
            <a 
              href={translation.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary"
            >
              View original source <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      <TranslationMetadata
        viewCount={translation.view_count || 0}
        featured={translation.featured || false}
        updatedAt={translation.updated_at || ''}
        createdAt={translation.created_at || ''}
        tags={translation.tags || []}
      />
    </div>
  );
};

export default TranslationHeader;