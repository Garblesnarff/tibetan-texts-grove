import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TitleEditControlsProps {
  onSave: () => void;
  onCancel: () => void;
}

/**
 * TitleEditControls Component
 * Renders save and cancel buttons for edit mode with tooltips
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onSave - Handler for save action
 * @param {Function} props.onCancel - Handler for cancel action
 */
const TitleEditControls = ({ onSave, onCancel }: TitleEditControlsProps) => {
  return (
    <div className="absolute top-2 right-2 space-x-2 bg-white p-2 rounded-md shadow-sm z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
            <span className="ml-2">Save</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Save changes</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
            <span className="ml-2">Cancel</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cancel editing</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default TitleEditControls;