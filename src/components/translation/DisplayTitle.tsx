import React from "react";

interface DisplayTitleProps {
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
}

/**
 * DisplayTitle Component
 * Renders the English and Tibetan titles in display mode
 * Ensures full titles are displayed without truncation
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} [props.englishTitle] - English title to display
 * @param {string} [props.tibetanTitle] - Tibetan title to display
 * @param {string} [props.originalTibetanFileName] - Original Tibetan filename
 */
const DisplayTitle = ({ 
  englishTitle, 
  tibetanTitle, 
  originalTibetanFileName 
}: DisplayTitleProps) => {
  return (
    <div className="break-words">
      {englishTitle && (
        <p className="text-gray-700 mb-2 whitespace-normal">
          {englishTitle}
        </p>
      )}
      {(originalTibetanFileName || tibetanTitle) && (
        <p className="text-tibetan-maroon font-tibetan text-xl whitespace-normal">
          {originalTibetanFileName || tibetanTitle}
        </p>
      )}
    </div>
  );
};

export default DisplayTitle;