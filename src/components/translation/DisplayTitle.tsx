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
    <div className="space-y-4">
      {englishTitle && (
        <h3 className="text-2xl font-semibold leading-tight text-tibetan-maroon group-hover:text-tibetan-maroon/80 transition-colors duration-200 drop-shadow-sm">
          {searchQuery ? (
            <span
              dangerouslySetInnerHTML={{
                __html: highlightText(englishTitle, searchQuery),
              }}
            />
          ) : (
            englishTitle
          )}
        </h3>
      )}
      {(originalTibetanFileName || tibetanTitle) && (
        <p className="text-xl text-tibetan-brown font-tibetan leading-relaxed group-hover:text-tibetan-brown/80 transition-colors duration-200">
          {searchQuery ? (
            <span
              dangerouslySetInnerHTML={{
                __html: highlightText(originalTibetanFileName || tibetanTitle || '', searchQuery),
              }}
            />
          ) : (
            originalTibetanFileName || tibetanTitle
          )}
        </p>
      )}
    </div>
  );
};

export default DisplayTitle;