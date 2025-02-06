import React from "react";
import { cn } from "@/lib/utils";

interface ViewerContainerProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const ViewerContainer = ({ children, onClick, className }: ViewerContainerProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-8 rounded-lg border border-tibetan-brown/20",
        "bg-gradient-to-br from-white to-tibetan-gold/5",
        "shadow-sm hover:shadow-lg transition-all duration-300",
        "group hover:scale-[1.02] cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tibetan-maroon",
        "hover:border-tibetan-gold/30 hover:bg-gradient-to-br hover:from-white hover:to-tibetan-gold/10",
        className
      )}
    >
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};