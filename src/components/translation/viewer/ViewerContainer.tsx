import React from "react";
import { Card } from "@/components/ui/card";

interface ViewerContainerProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}

export const ViewerContainer = ({ children, onClick }: ViewerContainerProps) => {
  return (
    <Card 
      className="p-8 bg-gradient-to-br from-white via-tibetan-gold/5 to-tibetan-maroon/10 
        hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] 
        relative min-h-[200px] border border-tibetan-gold/20" 
      onClick={onClick}
    >
      {children}
    </Card>
  );
};