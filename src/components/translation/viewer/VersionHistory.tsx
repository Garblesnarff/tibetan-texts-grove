import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Version {
  id: string;
  version_number: number;
  title: string;
  tibetan_title: string | null;
  description: string | null;
  created_at: string;
  created_by: string | null;
}

interface VersionHistoryProps {
  translationId: string;
  currentVersion: Version | null;
  onVersionSelect: (version: Version) => void;
}

export const VersionHistory = ({
  translationId,
  currentVersion,
  onVersionSelect,
}: VersionHistoryProps) => {
  const { toast } = useToast();

  const { data: versions, isLoading } = useQuery({
    queryKey: ["translation-versions", translationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("translation_versions")
        .select("*")
        .eq("translation_id", translationId)
        .order("version_number", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load version history",
        });
        throw error;
      }

      return data as Version[];
    },
  });

  if (isLoading) {
    return <div>Loading version history...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Version History</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!currentVersion || !versions?.find(v => v.version_number < currentVersion.version_number)}
            onClick={() => {
              const currentIndex = versions?.findIndex(v => v.id === currentVersion?.id) ?? -1;
              if (currentIndex !== -1 && versions?.[currentIndex + 1]) {
                onVersionSelect(versions[currentIndex + 1]);
              }
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Older
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!currentVersion || !versions?.find(v => v.version_number > currentVersion.version_number)}
            onClick={() => {
              const currentIndex = versions?.findIndex(v => v.id === currentVersion?.id) ?? -1;
              if (currentIndex > 0 && versions?.[currentIndex - 1]) {
                onVersionSelect(versions[currentIndex - 1]);
              }
            }}
          >
            Newer
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-4">
          {versions?.map((version) => (
            <button
              key={version.id}
              onClick={() => onVersionSelect(version)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentVersion?.id === version.id
                  ? "bg-primary/10 border border-primary"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Version {version.version_number}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(version.created_at), "PPp")}
                </span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {version.title}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};