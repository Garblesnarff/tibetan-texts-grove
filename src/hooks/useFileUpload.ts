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
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [translationFile, setTranslationFile] = useState<File | null>(null);
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
      const extractedTitle = extractTitleFromFileName(file.name);
      
      // Set file and title based on type
      if (fileType === 'translation') {
        setTranslationFile(file);
        setTitle(extractedTitle);
      } else if (fileType === 'source') {
        setSourceFile(file);
        setTibetanTitle(extractedTitle);
      }
    } catch (error: any) {
      console.error('File selection error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'An error occurred during file selection'
      });
    }
  };

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

      console.log('Uploading source file with data:', {
        fileType: 'source',
        title,
        tibetanTitle,
        fileName: sourceFile.name
      });

      const sourceResult = await supabase.functions.invoke('upload-translation', {
        body: sourceFormData,
      });

      if (sourceResult.error) throw sourceResult.error;

      setProgress(50);

      // Upload translation file
      const translationFormData = new FormData();
      translationFormData.append('file', translationFile);
      translationFormData.append('fileType', 'translation');
      translationFormData.append('title', title);
      translationFormData.append('tibetanTitle', tibetanTitle);

      console.log('Uploading translation file with data:', {
        fileType: 'translation',
        title,
        tibetanTitle,
        fileName: translationFile.name
      });

      const translationResult = await supabase.functions.invoke('upload-translation', {
        body: translationFormData,
      });

      if (translationResult.error) throw translationResult.error;

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