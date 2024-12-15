import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUploadField } from "./FileUploadField";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, fileType: 'source' | 'translation') => Promise<void>;
  uploading: boolean;
  progress: number;
  title: string;
  setTitle: (title: string) => void;
  tibetanTitle: string;
  setTibetanTitle: (title: string) => void;
}

/**
 * UploadDialog component handles the modal interface for file uploads
 * Contains form fields for titles and file uploads
 */
export function UploadDialog({
  open,
  onOpenChange,
  onFileUpload,
  uploading,
  progress,
  title,
  setTitle,
  tibetanTitle,
  setTibetanTitle
}: UploadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          <FileUploadField
            id="sourceFile"
            label="Tibetan Source PDF"
            disabled={uploading}
            onChange={(e) => onFileUpload(e, 'source')}
          />

          <FileUploadField
            id="translationFile"
            label="English Translation PDF"
            disabled={uploading}
            onChange={(e) => onFileUpload(e, 'translation')}
          />

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