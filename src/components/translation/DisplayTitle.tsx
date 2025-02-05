import React from "react";
import { highlightText } from "@/utils/highlightText";

interface DisplayTitleProps {
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
  searchQuery?: string;
}

const DisplayTitle = ({ 
  englishTitle, 
  tibetanTitle, 
  originalTibetanFileName,
  searchQuery = ''
}: DisplayTitleProps) => {
  return (
    <div className="break-words">
      {englishTitle && (
        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 md:mb-3 whitespace-normal break-words text-tibetan-brown">
          {highlightText(englishTitle, searchQuery)}
        </h3>
      )}
      {(originalTibetanFileName || tibetanTitle) && (
        <p className="text-lg md:text-xl text-tibetan-maroon font-tibetan whitespace-normal break-words mt-1 md:mt-2">
          {highlightText(originalTibetanFileName || tibetanTitle || '', searchQuery)}
        </p>
      )}
    </div>
  );
};

export default DisplayTitle;