"use client";

import React, { useEffect, useState } from "react";
import { X, Trash2, Loader2, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  taskTitle?: string;
}

export function DeleteTaskModal({ isOpen, onClose, onConfirm, taskTitle }: DeleteTaskModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, isDeleting]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-[#2F3A35]/20 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className={cn(
        "relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#DDE5E1] overflow-hidden transition-all duration-500 transform",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-8"
      )}>
        {/* Header Visual */}
        <div className="bg-[#F4F7F5] p-8 flex flex-col items-center justify-center border-b border-[#DDE5E1]">
          <div className="w-16 h-16 rounded-full bg-white border border-[#DDE5E1] flex items-center justify-center mb-4 shadow-sm">
            <Compass className="w-8 h-8 text-[#7C9A8B] animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-bold text-[#2F3A35] text-center">
            Remove Focus Area?
          </h2>
        </div>

        {/* Body */}
        <div className="p-8 text-center space-y-5">
          <p className="text-[#8A9E96] font-light leading-relaxed">
            You are about to release the focus on <span className="font-semibold text-[#2F3A35]">"{taskTitle || "this objective"}"</span>.
            <br />
            This intention will be cleared from your workspace.
          </p>

          {/* Actions */}
          <div className="pt-4 flex items-center gap-3">
            <button 
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 bg-[#F4F7F5] text-[#8A9E96] hover:text-[#5C6B64] py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Release Focus
                </>
              )}
            </button>
          </div>
        </div>

        {/* Close Button */}
        {!isDeleting && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#AFC8B8] hover:text-[#7C9A8B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
