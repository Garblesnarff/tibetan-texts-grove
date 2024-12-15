import { Input } from "@/components/ui/input";

interface FileUploadFieldProps {
  id: string;
  label: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * FileUploadField component handles individual file upload inputs
 * @param id - Unique identifier for the input field
 * @param label - Display label for the input field
 * @param disabled - Whether the input is disabled
 * @param onChange - Handler for file selection changes
 */
export function FileUploadField({ id, label, disabled, onChange }: FileUploadFieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id}>{label}</label>
      <Input
        id={id}
        type="file"
        accept=".pdf"
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}