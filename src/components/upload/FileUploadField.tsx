import { Input } from "@/components/ui/input";
import { FileUploadFieldProps } from "@/types/upload";

/**
 * FileUploadField component handles individual file upload inputs
 * Provides a labeled input field for PDF file uploads
 */
export function FileUploadField({ id, label, disabled, onChange }: FileUploadFieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        type="file"
        accept=".pdf"
        onChange={onChange}
        disabled={disabled}
        className="cursor-pointer"
      />
    </div>
  );
}