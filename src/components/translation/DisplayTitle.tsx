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
        <h3 className="text-xl font-semibold mb-3 whitespace-normal break-words text-tibetan-brown">
          {highlightText(englishTitle, searchQuery)}
        </h3>
      )}
      {(originalTibetanFileName || tibetanTitle) && (
        <p className="text-tibetan-maroon font-tibetan text-xl whitespace-normal break-words mt-2">
          {highlightText(originalTibetanFileName || tibetanTitle || '', searchQuery)}
        </p>
      )}
    </div>
  );
};

export default DisplayTitle;