import { FileType } from "@/types/upload";
import { useFileValidation } from "./useFileValidation";
import { useUploadState } from "./useUploadState";
import { useFileSubmission } from "./useFileSubmission";

/**
 * Main hook for handling file uploads
 * Coordinates between validation, state management, and submission
 */
export const useFileUpload = () => {
  const { verifyAdminStatus, extractTitleFromFileName, navigate, toast } = useFileValidation();
  const { 
    uploading, setUploading,
    progress, setProgress,
    title, setTitle,
    tibetanTitle, setTibetanTitle,
    open, setOpen,
    sourceFile, translationFile,
    updateFileState
  } = useUploadState();
  const { uploadFile } = useFileSubmission();

  /**
   * Handles file selection and validation
   * @param {React.ChangeEvent<HTMLInputElement>} event - File input change event
   * @param {FileType} fileType - Type of file being uploaded
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: FileType) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      await verifyAdminStatus();
      
      const file = event.target.files[0];
      const extractedTitle = extractTitleFromFileName(file.name);
      updateFileState(file, fileType, extractedTitle);
    } catch (error: any) {
      console.error('File selection error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'An error occurred during file selection'
      });
    }
  };

  /**
   * Handles the submission of both source and translation files
   */
  const handleSubmit = async () => {
    try {
      if (!sourceFile || !translationFile) {
        throw new Error('Both source and translation files are required.');
      }

      setUploading(true);
      setProgress(0);

      // Upload source file
      const sourceFormData = new FormData();
      sourceFormData.append('file', sourceFile);
      sourceFormData.append('fileType', 'source');
      sourceFormData.append('title', title);
      sourceFormData.append('tibetanTitle', tibetanTitle);

      await uploadFile(sourceFormData, 'source');
      setProgress(50);

      // Upload translation file
      const translationFormData = new FormData();
      translationFormData.append('file', translationFile);
      translationFormData.append('fileType', 'translation');
      translationFormData.append('title', title);
      translationFormData.append('tibetanTitle', tibetanTitle);

      await uploadFile(translationFormData, 'translation');
      setProgress(100);
      
      toast({
        title: "Success",
        description: "Files uploaded successfully"
      });
      
      setOpen(false);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'An error occurred during upload'
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploading,
    progress,
    title,
    setTitle,
    tibetanTitle,
    setTibetanTitle,
    open,
    setOpen,
    handleFileUpload,
    handleSubmit,
    sourceFile,
    translationFile,
    navigate,
    toast
  };
};