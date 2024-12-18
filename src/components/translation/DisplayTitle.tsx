import React from "react";

interface DisplayTitleProps {
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
}

/**
 * DisplayTitle Component
 * Renders the translation titles in display mode
 * Handles both English and Tibetan titles with proper formatting
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
        <h3 className="text-xl font-semibold mb-2 whitespace-normal break-words">
          {englishTitle}
        </h3>
      )}
      {(originalTibetanFileName || tibetanTitle) && (
        <p className="text-tibetan-maroon font-tibetan text-xl whitespace-normal break-words">
          {originalTibetanFileName || tibetanTitle}
        </p>
      )}
    </div>
  );
};

export default DisplayTitle;