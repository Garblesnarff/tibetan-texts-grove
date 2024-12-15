/**
 * Represents the type of file being uploaded
 */
export type FileType = 'source' | 'translation';

/**
 * Props for the FileUploadField component
 */
export interface FileUploadFieldProps {
  id: string;
  label: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Props for the UploadDialog component
 */
export interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, fileType: FileType) => void;
  uploading: boolean;
  progress: number;
  title: string;
  setTitle: (title: string) => void;
  tibetanTitle: string;
  setTibetanTitle: (title: string) => void;
  handleSubmit: () => Promise<void>;
  sourceFile: File | null;
  translationFile: File | null;
}