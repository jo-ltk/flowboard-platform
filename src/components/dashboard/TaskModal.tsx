"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Type,
  AlignLeft,
  Flag,
  CheckCircle2,
  Circle,
  Loader2,
  Target,
  ChevronDown,
  Calendar,
  UserCircle,
  Activity,
  Pause,
  AlertCircle,
  XCircle,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const STATUS_OPTIONS = [
  { value: "NOT_STARTED", label: "Not Started", icon: Circle, color: "#8A9E96" },
  { value: "ON_HOLD", label: "On Hold", icon: Pause, color: "#D97706" },
  { value: "IN_PROGRESS", label: "In Progress", icon: Activity, color: "#2563EB" },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle2, color: "#059669" },
  { value: "SUSPENDED", label: "Suspended", icon: AlertCircle, color: "#9333EA" },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle, color: "#DC2626" },
];

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
    assigneeId?: string;
  }) => Promise<void>;
  initialData?: {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate?: string;
    projectId?: string;
    assigneeId?: string;
  };
  projects?: { id: string; name: string }[];
  members?: { userId: string; name: string; email: string; image: string | null }[];
}

export function TaskModal({
  isOpen,
  onClose,
  onConfirm,
  initialData,
  projects = [],
  members = [],
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("NOT_STARTED");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setStatus(initialData?.status || "NOT_STARTED");
      setPriority(initialData?.priority || "MEDIUM");
      setDueDate(
        initialData?.dueDate && initialData.dueDate !== "No date" ? initialData.dueDate : ""
      );
      setProjectId(initialData?.projectId || (projects.length > 0 ? projects[0].id : ""));
      setAssigneeId(initialData?.assigneeId || "");
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
        projectId: projectId || undefined,
        assigneeId: assigneeId || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to process task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-[#2F3A35]/20 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={cn(
          "relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#DDE5E1] overflow-hidden transition-all duration-500 transform max-h-[90vh] overflow-y-auto",
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        )}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#2F3A35]">
              {initialData ? "Edit Task" : "New Task"}
            </h2>
            <p className="text-[#8A9E96] text-sm font-light">
              {initialData
                ? "Update the details of this task."
                : "Create a new task for your project."}
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
              Task Title
            </label>
            <input
              autoFocus
              required
              type="text"
              placeholder="e.g., Design the landing page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-3.5 text-[#2F3A35] font-medium outline-hidden transition-all text-base placeholder:text-[#AFC8B8]"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
              <AlignLeft className="w-3 h-3 text-[#7C9A8B]" />
              Description
            </label>
            <textarea
              placeholder="Add details about this task..."
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
              Project
            </label>
            <div className="relative">
              <select
                required
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full appearance-none bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-3 text-[#2F3A35] font-medium outline-hidden transition-all text-sm cursor-pointer"
              >
                <option value="" disabled>
                  Select a project...
                </option>
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

          {/* Assign To */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
              <UserCircle className="w-3 h-3 text-[#7C9A8B]" />
              Assign To
            </label>
            {members.length > 0 ? (
              <div className="space-y-2">
                <div className="relative">
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full appearance-none bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-3 text-[#2F3A35] font-medium outline-hidden transition-all text-sm cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                      <option key={member.userId} value={member.userId}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#AFC8B8]">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Selected Assignee Preview */}
                {assigneeId && (
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-[#7C9A8B]/5 border border-[#7C9A8B]/15 rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-[#E9EFEC] flex items-center justify-center text-[10px] font-bold text-[#7C9A8B] border border-[#DDE5E1]">
                      {getInitials(
                        members.find((m) => m.userId === assigneeId)?.name || "?"
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#2F3A35]">
                      {members.find((m) => m.userId === assigneeId)?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAssigneeId("")}
                      className="ml-auto p-1 rounded hover:bg-[#F4F7F5] text-[#8A9E96] hover:text-[#5C6B64] cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#8A9E96] bg-[#F4F7F5] border border-[#DDE5E1] rounded-xl px-5 py-3">
                No team members yet. Add people from the Team page first.
              </p>
            )}
          </div>

          {/* Status Selector — Visual Buttons */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-[#7C9A8B]" />
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isActive = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
                      isActive
                        ? "shadow-sm"
                        : "bg-[#F4F7F5] border-[#DDE5E1] text-[#8A9E96] hover:border-[#AFC8B8]"
                    )}
                    style={
                      isActive
                        ? {
                            backgroundColor: `${opt.color}12`,
                            borderColor: `${opt.color}40`,
                            color: opt.color,
                          }
                        : undefined
                    }
                  >
                    <Icon className="w-3 h-3" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
                <Flag className="w-3 h-3 text-[#7C9A8B]" />
                Priority
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

            {/* Due Date Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
                <Calendar className="w-3 h-3 text-[#7C9A8B]" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-2.5 text-[#2F3A35] text-[11px] font-bold uppercase tracking-wider outline-hidden transition-all cursor-pointer"
              />
            </div>
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
                <>Update Task</>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
