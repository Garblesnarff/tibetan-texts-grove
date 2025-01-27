import React from 'react';

export const highlightText = (text: string, searchQuery: string) => {
  if (!searchQuery.trim() || !text) return text;

  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));

  return parts.map((part, index) => {
    if (part.toLowerCase() === searchQuery.toLowerCase()) {
      return (
        <span
          key={index}
          className="bg-amber-100 text-tibetan-brown rounded px-0.5"
        >
          {part}
        </span>
      );
    }
    return part;
  });
};