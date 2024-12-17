import { useState } from "react";
import { FileType } from "@/types/upload";

/**
 * Hook for managing file upload state
 * Handles progress tracking and file selection state
 */
export const useUploadState = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [tibetanTitle, setTibetanTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [translationFile, setTranslationFile] = useState<File | null>(null);

  /**
   * Updates the file state based on file type
   * @param {File} file - The selected file
   * @param {FileType} fileType - Type of file (source or translation)
   * @param {string} extractedTitle - Title extracted from filename
   */
  const updateFileState = (file: File, fileType: FileType, extractedTitle: string) => {
    if (fileType === 'translation') {
      setTranslationFile(file);
      setTitle(extractedTitle);
    } else if (fileType === 'source') {
      setSourceFile(file);
      setTibetanTitle(extractedTitle);
    }
  };

  return {
    uploading,
    setUploading,
    progress,
    setProgress,
    title,
    setTitle,
    tibetanTitle,
    setTibetanTitle,
    open,
    setOpen,
    sourceFile,
    translationFile,
    updateFileState
  };
};