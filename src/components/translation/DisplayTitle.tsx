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