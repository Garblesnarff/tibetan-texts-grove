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
 * Prevents click events from propagating to parent elements
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
  /**
   * Handles click events on the input field
   * Prevents event propagation to parent elements
   * @param {React.MouseEvent} e - The click event object
   */
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      onClick={handleClick}
    />
  );
};

export default EditableTitle;