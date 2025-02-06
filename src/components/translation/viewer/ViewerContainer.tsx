import React from "react";
import { Card } from "@/components/ui/card";

interface ViewerContainerProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}

export const ViewerContainer = ({ children, onClick }: ViewerContainerProps) => {
  return (
    <Card 
      className="p-6 bg-gradient-to-br from-white to-tibetan-gold/5 hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] relative min-h-[200px]" 
      onClick={onClick}
    >
      {children}
    </Card>
  );
};