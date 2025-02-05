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
    <div className="break-words space-y-4">
      {englishTitle && (
        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold whitespace-normal break-words 
          text-tibetan-brown drop-shadow-sm">
          {highlightText(englishTitle, searchQuery)}
        </h3>
      )}
      {(originalTibetanFileName || tibetanTitle) && (
        <p className="text-lg md:text-xl text-tibetan-maroon font-tibetan whitespace-normal 
          break-words drop-shadow-sm tracking-wide">
          {highlightText(originalTibetanFileName || tibetanTitle || '', searchQuery)}
        </p>
      )}
    </div>
  );
};

export default DisplayTitle;