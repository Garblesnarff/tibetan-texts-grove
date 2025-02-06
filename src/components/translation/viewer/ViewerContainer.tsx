import React from "react";
import { Card } from "@/components/ui/card";

interface ViewerContainerProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}

export const ViewerContainer = ({ children, onClick }: ViewerContainerProps) => {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow relative min-h-[200px]" 
      onClick={onClick}
    >
      {children}
    </Card>
  );
};