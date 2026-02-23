"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer z-50 transition-all duration-300 hover:-translate-y-1 ${
        isOpen 
          ? "bg-sage-deep text-cream shadow-md" 
          : "bg-surface-elevated text-soft-blue border border-soft-blue/20 shadow-md"
      }`}
    >
      <div className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}>
        <MessageCircle className={`w-8 h-8 ${isOpen ? "text-light-green" : "text-soft-blue"}`} />
      </div>
    </button>
  );
}
