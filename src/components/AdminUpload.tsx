import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DialogTrigger } from "@/components/ui/dialog";
import { UploadDialog } from "./upload/UploadDialog";

type FileType = 'source' | 'translation';

/**
 * AdminUpload component handles the file upload functionality for administrators
 * Includes authentication checks and file upload management
 */
export function AdminUpload() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [tibetanTitle, setTibetanTitle] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Verifies if the current user has admin privileges
   * Redirects to login if not authenticated or lacks admin rights
   */
  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Please log in first."
      });
      navigate('/login');
      return;
    }
    
    // Set admin status based on email
    const isAdminUser = user.email === 'wonky.coin@gmail.com';
    setIsAdmin(isAdminUser);
    
    if (!isAdminUser) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have admin privileges."
      });
      navigate('/login');
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  /**
   * Handles file upload process including storage and database updates
   * @param event - File input change event
   * @param fileType - Type of file being uploaded (source or translation)
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: FileType) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setProgress(0);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileType}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('admin_translations')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Save translation metadata to database
      const { error: dbError } = await supabase
        .from('translations')
        .insert({
          title,
          tibetan_title: tibetanTitle,
          source_file_path: fileType === 'source' ? filePath : null,
          translation_file_path: fileType === 'translation' ? filePath : null,
          metadata: {
            uploadedAt: new Date().toISOString(),
            fileType: file.type
          }
        });

      if (dbError) throw dbError;

      setProgress(100);
      toast({
        title: "Success",
        description: `${fileType} file uploaded successfully`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <DialogTrigger asChild>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Upload Translation
      </Button>
      <UploadDialog
        open={open}
        onOpenChange={setOpen}
        onFileUpload={handleFileUpload}
        uploading={uploading}
        progress={progress}
        title={title}
        setTitle={setTitle}
        tibetanTitle={tibetanTitle}
        setTibetanTitle={setTibetanTitle}
      />
    </DialogTrigger>
  );
}