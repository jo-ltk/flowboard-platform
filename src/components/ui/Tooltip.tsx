"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const Tooltip = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
    </div>
  );
};

export const TooltipTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => {
  return <>{children}</>;
};

export const TooltipContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn(
      "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none transition-all duration-200",
      "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100",
      className
    )}>
      {children}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-sage-deep" />
    </div>
  );
};
