"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Type, AlignLeft, Flag, CheckCircle2, Circle, Loader2, Target, ChevronDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskData: { 
    title: string; 
    description: string; 
    status: string; 
    priority: string; 
    dueDate?: string;
    projectId?: string;
  }) => Promise<void>;
  initialData?: {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate?: string;
    projectId?: string;
  };
  projects?: { id: string; name: string }[];
}

export function TaskModal({ isOpen, onClose, onConfirm, initialData, projects = [] }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setStatus(initialData?.status || "TODO");
      setPriority(initialData?.priority || "MEDIUM");
      setDueDate(initialData?.dueDate && initialData.dueDate !== "No date" ? initialData.dueDate : "");
      setProjectId(initialData?.projectId || (projects.length > 0 ? projects[0].id : ""));
    }
  }, [isOpen, initialData, projects]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirm({ 
        title, 
        description, 
        status, 
        priority, 
        dueDate: dueDate || undefined,
        projectId: projectId || undefined
      });
      onClose();
    } catch (error) {
      console.error("Failed to process task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-[#2F3A35]/20 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={cn(
        "relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#DDE5E1] overflow-hidden transition-all duration-500 transform",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
      )}>
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#2F3A35]">
              {initialData ? "Refine Intent" : "New Focus Area"}
            </h2>
            <p className="text-[#8A9E96] text-sm font-light">
              {initialData ? "Adjust the details of this objective." : "Define a new area of focus for your workspace."}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#F4F7F5] text-[#AFC8B8] hover:text-[#7C9A8B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
              <Type className="w-3 h-3 text-[#7C9A8B]" />
              Objective Title
            </label>
            <input 
              autoFocus
              required
              type="text"
              placeholder="e.g., Spring Launch Strategy"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-3.5 text-[#2F3A35] font-medium outline-hidden transition-all text-base placeholder:text-[#AFC8B8]"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
              <AlignLeft className="w-3 h-3 text-[#7C9A8B]" />
              Context & Details
            </label>
            <textarea 
              placeholder="Add relevant notes or sub-tasks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-3.5 text-[#2F3A35] font-medium outline-hidden transition-all text-sm placeholder:text-[#AFC8B8] resize-none"
            />
          </div>

          {/* Project Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
              <Target className="w-3 h-3 text-[#7C9A8B]" />
              Project Integration
            </label>
            <div className="relative">
              <select 
                required
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full appearance-none bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-3 text-[#2F3A35] font-medium outline-hidden transition-all text-sm cursor-pointer"
              >
                <option value="" disabled>Select a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#AFC8B8]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-[#7C9A8B]" />
                Current State
              </label>
              <div className="relative">
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-2.5 text-[#2F3A35] text-[11px] font-bold uppercase tracking-wider outline-hidden transition-all cursor-pointer"
                >
                  <option value="TODO">Discovery</option>
                  <option value="IN_PROGRESS">Flowing</option>
                  <option value="COMPLETED">Harmonized</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#AFC8B8]">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Priority Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
                <Flag className="w-3 h-3 text-[#7C9A8B]" />
                Intensity
              </label>
              <div className="relative">
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full appearance-none bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-2.5 text-[#2F3A35] text-[11px] font-bold uppercase tracking-wider outline-hidden transition-all cursor-pointer"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#AFC8B8]">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Due Date Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
              <Calendar className="w-3 h-3 text-[#7C9A8B]" />
              Target Horizon
            </label>
            <input 
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-2.5 text-[#2F3A35] text-[11px] font-bold uppercase tracking-wider outline-hidden transition-all cursor-pointer"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#F4F7F5] text-[#8A9E96] hover:text-[#5C6B64] py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              disabled={isSubmitting || !title.trim()}
              type="submit"
              className="flex-2 bg-[#7C9A8B] text-white hover:bg-[#5F7D6E] py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : initialData ? (
                <>Update Intent</>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Initiate Flow
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
