import { useState } from "react";

/**
 * Custom hook for managing translation title editing
 * Handles state and reset functionality for both English and Tibetan titles
 * 
 * @param {string} initialEnglishTitle - Initial English title value
 * @param {string} initialTibetanTitle - Initial Tibetan title value
 * @returns Object containing title states and management functions
 */
export const useTitleEditor = (initialEnglishTitle?: string, initialTibetanTitle?: string) => {
  const [editedEnglishTitle, setEditedEnglishTitle] = useState(initialEnglishTitle || "");
  const [editedTibetanTitle, setEditedTibetanTitle] = useState(initialTibetanTitle || "");

  /**
   * Resets both titles to their initial values
   */
  const resetTitles = () => {
    setEditedEnglishTitle(initialEnglishTitle || "");
    setEditedTibetanTitle(initialTibetanTitle || "");
  };

  return {
    editedEnglishTitle,
    editedTibetanTitle,
    setEditedEnglishTitle,
    setEditedTibetanTitle,
    resetTitles
  };
};