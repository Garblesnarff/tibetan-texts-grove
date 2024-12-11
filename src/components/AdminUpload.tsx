import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type FileType = 'source' | 'translation';

export function AdminUpload() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [tibetanTitle, setTibetanTitle] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

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
    const isAdminUser = user.email === 'your-admin-email@example.com'; // Replace with your admin email
    setIsAdmin(isAdminUser);
    
    if (!isAdminUser) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have admin privileges."
      });
    }
  };

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
      if (fileType === 'translation') {
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
      }

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload Translation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Translation</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">English Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter English title"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="tibetanTitle">Tibetan Title</label>
            <Input
              id="tibetanTitle"
              value={tibetanTitle}
              onChange={(e) => setTibetanTitle(e.target.value)}
              placeholder="Enter Tibetan title"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="sourceFile">Tibetan Source PDF</label>
            <Input
              id="sourceFile"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e, 'source')}
              disabled={uploading}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="translationFile">English Translation PDF</label>
            <Input
              id="translationFile"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e, 'translation')}
              disabled={uploading}
            />
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-gray-500">Uploading... {progress}%</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}