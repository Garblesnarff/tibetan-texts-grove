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
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('You must be logged in to upload files.');
    }

    if (session.user.email !== 'wonky.coin@gmail.com') {
      throw new Error('Only admin users can upload files.');
    }

    return session;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: FileType) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      const file = event.target.files[0];
      const session = await verifyAdminStatus();
      
      setUploading(true);
      setProgress(0);

      // Generate file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileType}/${fileName}`;

      // Upload file to storage first
      const { error: uploadError } = await supabase.storage
        .from('admin_translations')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Then update or create the database record
      const updateData = fileType === 'source' 
        ? { source_file_path: filePath }
        : { translation_file_path: filePath };

      const { data: existingTranslation } = await supabase
        .from('translations')
        .select()
        .eq('title', title)
        .single();

      if (existingTranslation) {
        // Update existing translation
        const { error: updateError } = await supabase
          .from('translations')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingTranslation.id);

        if (updateError) {
          // If update fails, delete the uploaded file
          await supabase.storage
            .from('admin_translations')
            .remove([filePath]);
          throw updateError;
        }
      } else {
        // Create new translation record
        const { error: insertError } = await supabase
          .from('translations')
          .insert({
            title,
            tibetan_title: tibetanTitle,
            created_by: session.user.id,
            ...updateData,
            metadata: {
              uploadedAt: new Date().toISOString(),
              fileType: file.type,
              originalName: file.name
            }
          });

        if (insertError) {
          // If insert fails, delete the uploaded file
          await supabase.storage
            .from('admin_translations')
            .remove([filePath]);
          throw insertError;
        }
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