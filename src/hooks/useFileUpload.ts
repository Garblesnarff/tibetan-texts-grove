import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileType } from "@/types/upload";

/**
 * Custom hook to handle file upload functionality
 * Manages upload state, progress, and database interactions
 */
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [tibetanTitle, setTibetanTitle] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Handles file upload process including storage and database updates
   * @param event - File input change event
   * @param fileType - Type of file being uploaded (source or translation)
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: FileType) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      const file = event.target.files[0];
      
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('You must be logged in to upload files.');
      }

      // Verify admin status
      if (session.user.email !== 'wonky.coin@gmail.com') {
        throw new Error('Only admin users can upload files.');
      }

      setUploading(true);
      setProgress(0);

      // First create the database record
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileType}/${fileName}`;

      // Save translation metadata to database first
      const { error: dbError } = await supabase
        .from('translations')
        .insert({
          title,
          tibetan_title: tibetanTitle,
          source_file_path: fileType === 'source' ? filePath : null,
          translation_file_path: fileType === 'translation' ? filePath : null,
          created_by: session.user.id,
          metadata: {
            uploadedAt: new Date().toISOString(),
            fileType: file.type,
            originalName: file.name
          }
        });

      if (dbError) throw dbError;

      // Then upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('admin_translations')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setProgress(100);
      toast({
        title: "Success",
        description: `${fileType} file uploaded successfully`
      });
      
      // Close the dialog after successful upload
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
    navigate,
    toast
  };
};