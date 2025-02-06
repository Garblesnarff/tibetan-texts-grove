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
        "relative p-6 rounded-lg border border-tibetan-brown/20",
        "bg-gradient-to-br from-white to-tibetan-gold/5",
        "shadow-sm hover:shadow-md transition-all duration-300",
        "group hover:scale-[1.02] cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tibetan-maroon/50",
        className
      )}
    >
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};