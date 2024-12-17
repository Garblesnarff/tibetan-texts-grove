import React from "react";

interface DisplayTitleProps {
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
}

/**
 * DisplayTitle Component
 * Renders the English and Tibetan titles in display mode
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
    <>
      {englishTitle && (
        <p className="text-gray-700 mb-2">
          {englishTitle}
        </p>
      )}
      {(originalTibetanFileName || tibetanTitle) && (
        <p className="text-tibetan-maroon font-tibetan text-xl">
          {originalTibetanFileName || tibetanTitle}
        </p>
      )}
    </>
  );
};

export default DisplayTitle;