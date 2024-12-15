import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileType } from "@/types/upload";

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [tibetanTitle, setTibetanTitle] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const verifyAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('You must be logged in to upload files.');
    }

    if (session.user.email !== 'wonky.coin@gmail.com') {
      throw new Error('Only admin users can upload files.');
    }

    return session;
  };

  const extractTitleFromFileName = (fileName: string) => {
    // Remove file extension
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    // Convert dashes/underscores to spaces and capitalize words
    return nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: FileType) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      await verifyAdminStatus();
      
      const file = event.target.files[0];
      
      // Set the appropriate title based on file type
      if (fileType === 'translation') {
        const extractedTitle = extractTitleFromFileName(file.name);
        setTitle(extractedTitle);
      } else if (fileType === 'source') {
        const extractedTitle = extractTitleFromFileName(file.name);
        setTibetanTitle(extractedTitle);
      }

      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);
      formData.append('title', title.trim());
      formData.append('tibetanTitle', tibetanTitle.trim());
      
      console.log('Uploading file with data:', {
        fileType,
        title: title.trim(),
        tibetanTitle: tibetanTitle.trim(),
        fileName: file.name
      });

      const { data, error } = await supabase.functions.invoke('upload-translation', {
        body: formData,
      });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      setProgress(100);
      toast({
        title: "Success",
        description: `${fileType} file uploaded successfully`
      });
      
      if (fileType === 'translation') {
        setOpen(false);
      }
      
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