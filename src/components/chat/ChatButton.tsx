"use client";

import React from "react";
import { MessageCircle, X } from "lucide-react";

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-16 h-16 rounded-none flex items-center justify-center cursor-pointer z-50 transition-all duration-500 scale-90 sm:scale-100 ${
        isOpen 
          ? "bg-[#2F3A35] text-white shadow-2xl" 
          : "bg-[#8CBA41] text-white shadow-xl hover:bg-[#2F3A35]"
      }`}
    >
      <div className={`transition-transform duration-500 ${isOpen ? "rotate-90" : "rotate-0"}`}>
        {isOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <MessageCircle className="w-8 h-8" />
        )}
      </div>
      {/* Decorative accent corner */}
      {!isOpen && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-[#2F3A35]" />
      )}
    </button>
  );
}
