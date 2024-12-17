import React from "react";
import { Input } from "@/components/ui/input";

interface EditableTitleProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

/**
 * EditableTitle Component
 * Renders an input field for editing titles
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.value - Current title value
 * @param {Function} props.onChange - Callback for value changes
 * @param {string} props.placeholder - Placeholder text for empty input
 * @param {string} [props.className] - Additional CSS classes
 */
const EditableTitle = ({ 
  value, 
  onChange, 
  placeholder,
  className 
}: EditableTitleProps) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default EditableTitle;