import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface TitleEditControlsProps {
  onSave: () => void;
  onCancel: () => void;
}

/**
 * TitleEditControls Component
 * Renders save and cancel buttons for edit mode
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onSave - Handler for save action
 * @param {Function} props.onCancel - Handler for cancel action
 */
const TitleEditControls = ({ onSave, onCancel }: TitleEditControlsProps) => {
  return (
    <div className="absolute top-0 right-0 space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onSave}
        className="h-8 w-8"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onCancel}
        className="h-8 w-8"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TitleEditControls;