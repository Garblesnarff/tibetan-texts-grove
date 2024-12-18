import React from "react";

interface DisplayTitleProps {
  englishTitle?: string;
  tibetanTitle?: string;
  originalTibetanFileName?: string;
}

const DisplayTitle = ({ 
  englishTitle, 
  tibetanTitle, 
  originalTibetanFileName 
}: DisplayTitleProps) => {
  return (
    <div className="break-words">
      {englishTitle && (
        <h3 className="text-xl font-semibold mb-3 whitespace-normal break-words text-tibetan-brown">
          {englishTitle}
        </h3>
      )}
      {(originalTibetanFileName || tibetanTitle) && (
        <p className="text-tibetan-maroon font-tibetan text-xl whitespace-normal break-words mt-2">
          {originalTibetanFileName || tibetanTitle}
        </p>
      )}
    </div>
  );
};

export default DisplayTitle;