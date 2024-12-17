import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for handling file submission to Supabase
 * Manages the upload process and error handling
 */
export const useFileSubmission = () => {
  /**
   * Uploads a file to Supabase storage
   * @param {FormData} formData - Form data containing file and metadata
   * @param {string} fileType - Type of file being uploaded
   * @returns {Promise} Upload result
   */
  const uploadFile = async (formData: FormData, fileType: 'source' | 'translation') => {
    console.log(`Uploading ${fileType} file with data:`, {
      fileType,
      title: formData.get('title'),
      tibetanTitle: formData.get('tibetanTitle'),
      fileName: formData.get('file')
    });

    const result = await supabase.functions.invoke('upload-translation', {
      body: formData,
    });

    if (result.error) throw result.error;
    return result;
  };

  return {
    uploadFile
  };
};