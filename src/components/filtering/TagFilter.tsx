import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TagCount {
  tag: string;
  count: number;
}

interface TagFilterProps {
  availableTags: TagCount[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
}

export function TagFilter({
  availableTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
}: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 w-[180px] justify-start">
            <Tag className="mr-2 h-4 w-4" />
            Filter by tags
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {availableTags.map(({ tag, count }) => (
            <DropdownMenuItem
              key={tag}
              onClick={() => onTagSelect(tag)}
              className="cursor-pointer"
            >
              <span className="flex-1">{tag}</span>
              <Badge variant="secondary" className="ml-2">
                {count}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Tooltip key={tag}>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 cursor-default"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onTagRemove(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {availableTags.find(t => t.tag === tag)?.count || 0} translations
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}