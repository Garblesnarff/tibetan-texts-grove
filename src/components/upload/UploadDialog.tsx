import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileUploadField } from "./FileUploadField";
import { UploadDialogProps } from "@/types/upload";

/**
 * UploadDialog component handles the modal interface for file uploads
 * Contains form fields for titles and file uploads with progress indication
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
  setTibetanTitle,
  handleSubmit,
  sourceFile,
  translationFile
}: UploadDialogProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Upload Translation</DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium">
            English Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter English title"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="tibetanTitle" className="text-sm font-medium">
            Tibetan Title
          </label>
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
            <p className="text-sm text-gray-500">
              Uploading... {progress}%
            </p>
          </div>
        )}

        <Button 
          onClick={handleSubmit}
          disabled={uploading || !sourceFile || !translationFile}
        >
          Upload Files
        </Button>
      </div>
    </DialogContent>
  );
}