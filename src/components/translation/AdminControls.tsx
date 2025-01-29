import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { FeaturedToggle } from "./admin/FeaturedToggle";
import { TagManager } from "./admin/TagManager";
import { ViewCountManager } from "./admin/ViewCountManager";

interface AdminControlsProps {
  translationId: string;
  featured: boolean;
  tags: string[];
  viewCount: number;
  onUpdate: () => Promise<void>;
}

export const AdminControls = ({ 
  translationId, 
  featured, 
  tags = [], 
  viewCount = 0,
  onUpdate 
}: AdminControlsProps) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-2">
        <FeaturedToggle
          translationId={translationId}
          featured={featured}
          onUpdate={onUpdate}
        />
      </div>

      <TagManager
        translationId={translationId}
        tags={tags}
        onUpdate={onUpdate}
      />

      <ViewCountManager
        translationId={translationId}
        viewCount={viewCount}
        onUpdate={onUpdate}
      />
    </div>
  );
};