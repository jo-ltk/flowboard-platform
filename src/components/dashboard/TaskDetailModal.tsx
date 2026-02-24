"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  CheckCircle2,
  Circle,
  Loader2,
  Send,
  Trash2,
  Sparkles,
  ArrowUpRight,
  Calendar,
  UserCircle,
  Flag,
  Target,
  MessageSquare,
  ListChecks,
  MoreVertical,
  Edit3,
  Clock,
  ChevronRight,
  GripVertical,
  Lightbulb,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorImage: string | null;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: string;
  assigneeId: string | null;
  assigneeEmail: string | null;
  assigneeImage: string | null;
  project: string;
  projectId: string;
  order: number;
  subtasks: Subtask[];
  subtaskTotal: number;
  subtaskCompleted: number;
  commentCount: number;
}

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdate: () => void;
  onTaskChange?: (task: Task) => void;
  workspaceId?: string;
  projects?: { id: string; name: string }[];
  members?: { userId: string; name: string; email: string; image: string | null }[];
}

const STATUS_OPTIONS = [
  { value: "NOT_STARTED", label: "Not Started", color: "#8A9E96" },
  { value: "ON_HOLD", label: "On Hold", color: "#D97706" },
  { value: "IN_PROGRESS", label: "In Progress", color: "#2563EB" },
  { value: "COMPLETED", label: "Completed", color: "#059669" },
  { value: "SUSPENDED", label: "Suspended", color: "#9333EA" },
  { value: "CANCELLED", label: "Cancelled", color: "#DC2626" },
];

export function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onTaskUpdate,
  onTaskChange,
  workspaceId,
  projects = [],
  members = [],
}: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"subtasks" | "comments">("subtasks");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingSubtask, setIsSubmittingSubtask] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const subtaskInputRef = useRef<HTMLInputElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description);
      setNewSubtaskTitle("");
      setNewComment("");
      fetchComments(task.id);
    }
  }, [isOpen, task]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      // Focus first input when opened
      setTimeout(() => subtaskInputRef.current?.focus(), 100);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const fetchComments = async (taskId: string) => {
    try {
      setLoadingComments(true);
      const res = await fetch(`/api/dashboard/comments?taskId=${taskId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (e) {
      console.error("Error fetching comments:", e);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleSubtask = async (subtaskId: string, completed: boolean) => {
    if (!task) return;
    try {
      const res = await fetch(`/api/dashboard/subtasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: subtaskId, completed: !completed }),
      });
      if (res.ok) {
        // Optimistically update the modal's task state
        const updatedSubtasks = task.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !completed } : s
        );
        const completedCount = updatedSubtasks.filter((s) => s.completed).length;
        onTaskChange?.({ ...task, subtasks: updatedSubtasks, subtaskCompleted: completedCount });
        onTaskUpdate();
      }
    } catch (e) {
      toast.error("Failed to update subtask");
    }
  };

  const addSubtask = async () => {
    if (!newSubtaskTitle.trim() || !task) return;
    setIsSubmittingSubtask(true);
    try {
      const res = await fetch(`/api/dashboard/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newSubtaskTitle, taskId: task.id }),
      });
      if (res.ok) {
        setNewSubtaskTitle("");
        toast.success("Subtask added");
        // Re-fetch task list so the modal gets the new subtask
        const wsId = workspaceId || task.projectId;
        const response = await fetch(`/api/dashboard/tasks?workspaceId=${wsId}`);
        if (response.ok) {
          const tasks = await response.json();
          const updatedTask = tasks.find((t: any) => t.id === task.id);
          if (updatedTask) onTaskChange?.(updatedTask);
        }
        onTaskUpdate();
        // Keep focus on input
        subtaskInputRef.current?.focus();
      }
    } catch (e) {
      toast.error("Failed to add subtask");
    } finally {
      setIsSubmittingSubtask(false);
    }
  };

  const deleteSubtask = async (subtaskId: string) => {
    if (!task) return;
    try {
      const res = await fetch(`/api/dashboard/subtasks?id=${subtaskId}`, { method: "DELETE" });
      if (res.ok) {
        // Optimistically update the modal's task state
        const updatedSubtasks = task.subtasks.filter((s) => s.id !== subtaskId);
        const completedCount = updatedSubtasks.filter((s) => s.completed).length;
        onTaskChange?.({ ...task, subtasks: updatedSubtasks, subtaskTotal: updatedSubtasks.length, subtaskCompleted: completedCount });
        onTaskUpdate();
        toast.success("Subtask removed");
      }
    } catch (e) {
      toast.error("Failed to remove subtask");
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !task) return;
    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/dashboard/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          taskId: task.id,
          authorName: "You",
        }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments(task.id);
        onTaskUpdate();
        toast.success("Comment added");
        // Keep focus on input
        commentInputRef.current?.focus();
      }
    } catch (e) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const synthesizeSubtasks = async () => {
    if (!task) return;
    try {
      setIsSynthesizing(true);
      const res = await fetch("/api/ai/subtasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          title: task.title,
          description: task.description,
        }),
      });

      if (!res.ok) throw new Error("AI Synthesis failed");

      toast.success("AI created a checklist for you!");

      // Fetch updated task data (including the newly created subtasks)
      const wsId = workspaceId || task.projectId;
      const response = await fetch(`/api/dashboard/tasks?workspaceId=${wsId}`);
      if (response.ok) {
        const tasks = await response.json();
        const updatedTask = tasks.find((t: any) => t.id === task.id);
        if (updatedTask) {
          // Push the new subtask list into the modal so it re-renders immediately
          onTaskChange?.(updatedTask);
        }
      }
      // Also refresh the parent task list (cards, progress bars, etc.)
      onTaskUpdate();
    } catch (err) {
      toast.error("AI couldn't generate subtasks");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const updateTaskField = async (field: "title" | "description", value: string) => {
    if (!task) return;
    try {
      const res = await fetch(`/api/dashboard/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, [field]: value }),
      });
      if (res.ok) {
        onTaskUpdate();
      }
    } catch (e) {
      toast.error(`Failed to update ${field}`);
    }
  };

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== task?.title) {
      updateTaskField("title", editedTitle);
    }
    setEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    if (editedDescription !== task?.description) {
      updateTaskField("description", editedDescription);
    }
    setEditingDescription(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  const getInitials = (name: string) => {
    if (!name || name === "Unassigned") return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusColor = (status: string) => {
    return STATUS_OPTIONS.find((s) => s.value === status)?.color || "#8A9E96";
  };

  if (!isOpen || !task) return null;

  const subtaskProgress = task.subtaskTotal > 0
    ? Math.round((task.subtaskCompleted / task.subtaskTotal) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2F3A35]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-[#DDE5E1] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#E9EFEC] bg-gradient-to-r from-[#FAFCFB] to-white">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              {/* Project Badge */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4F7F5] border border-[#DDE5E1]">
                  <Target className="w-3 h-3 text-[#7C9A8B]" />
                  <span className="text-[10px] font-semibold text-[#5C6B64]">
                    {task.project || "No Project"}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                  style={{
                    backgroundColor: `${getStatusColor(task.status)}10`,
                    borderColor: `${getStatusColor(task.status)}30`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  />
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: getStatusColor(task.status) }}
                  >
                    {STATUS_OPTIONS.find((s) => s.value === task.status)?.label || task.status}
                  </span>
                </div>
              </div>

              {/* Editable Title */}
              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                    className="flex-1 text-xl font-bold text-[#2F3A35] bg-white border-2 border-[#7C9A8B] rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#7C9A8B]/20"
                    autoFocus
                  />
                  <button
                    onClick={handleTitleSave}
                    className="p-1.5 rounded-lg bg-[#7C9A8B] text-white hover:bg-[#5F7D6E]"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 group cursor-pointer"
                  onClick={() => setEditingTitle(true)}
                >
                  <h2 className="text-xl font-bold text-[#2F3A35] truncate">
                    {task.title}
                  </h2>
                  <Edit3 className="w-4 h-4 text-[#AFC8B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#F4F7F5] text-[#8A9E96] hover:text-[#5C6B64] transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Meta Row */}
          <div className="flex items-center gap-4 mt-3 text-xs">
            {/* Priority */}
            <div className="flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-[#AFC8B8]" />
              <span
                className={cn(
                  "font-bold uppercase tracking-wider",
                  task.priority === "HIGH"
                    ? "text-red-500"
                    : task.priority === "MEDIUM"
                    ? "text-orange-500"
                    : "text-[#7C9A8B]"
                )}
              >
                {task.priority}
              </span>
            </div>

            {/* Due Date */}
            {task.dueDate !== "No date" && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#AFC8B8]" />
                <span className="text-[#5C6B64] font-medium">{task.dueDate}</span>
              </div>
            )}

            {/* Assignee */}
            <div className="flex items-center gap-1.5">
              {task.assigneeImage ? (
                <img
                  src={task.assigneeImage}
                  alt={task.assignee}
                  className="w-5 h-5 rounded-full object-cover border border-[#DDE5E1]"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#F4F7F5] flex items-center justify-center text-[8px] font-bold text-[#AFC8B8] border border-dashed border-[#DDE5E1]">
                  {getInitials(task.assignee)}
                </div>
              )}
              <span className="text-[#5C6B64] font-medium">{task.assignee}</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="px-6 py-4 border-b border-[#E9EFEC] bg-white">
          {editingDescription ? (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96]">
                Description
              </label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onBlur={handleDescriptionSave}
                className="w-full h-24 bg-white border-2 border-[#7C9A8B] rounded-xl px-4 py-2 text-sm text-[#2F3A35] outline-none focus:ring-2 focus:ring-[#7C9A8B]/20 resize-none"
                autoFocus
                placeholder="Add a description..."
              />
              <div className="flex justify-end">
                <button
                  onClick={handleDescriptionSave}
                  className="px-3 py-1.5 rounded-lg bg-[#7C9A8B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#5F7D6E]"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div
              className="group cursor-pointer"
              onClick={() => setEditingDescription(true)}
            >
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96]">
                  Description
                </label>
                <Edit3 className="w-3 h-3 text-[#AFC8B8] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-[#5C6B64] leading-relaxed min-h-[20px]">
                {task.description || (
                  <span className="text-[#AFC8B8] italic">Click to add description...</span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-[#E9EFEC] bg-white">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("subtasks")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all relative",
                activeTab === "subtasks"
                  ? "text-[#2F3A35] bg-[#F4F7F5]"
                  : "text-[#8A9E96] hover:text-[#5C6B64] hover:bg-[#F4F7F5]/50"
              )}
            >
              <ListChecks className="w-4 h-4" />
              Subtasks
              {task.subtaskTotal > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#7C9A8B]/20 text-[#7C9A8B] text-[10px]">
                  {task.subtaskCompleted}/{task.subtaskTotal}
                </span>
              )}
              {activeTab === "subtasks" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C9A8B]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all relative",
                activeTab === "comments"
                  ? "text-[#2F3A35] bg-[#F4F7F5]"
                  : "text-[#8A9E96] hover:text-[#5C6B64] hover:bg-[#F4F7F5]/50"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              Comments
              {comments.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#7C9A8B]/20 text-[#7C9A8B] text-[10px]">
                  {comments.length}
                </span>
              )}
              {activeTab === "comments" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C9A8B]" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto bg-[#FAFCFB]">
          {activeTab === "subtasks" ? (
            <div className="p-6 space-y-4">
              {/* Progress Bar */}
              {task.subtaskTotal > 0 && (
                <div className="bg-white rounded-xl p-4 border border-[#E9EFEC]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#5C6B64]">
                      Progress
                    </span>
                    <span className="text-xs font-bold text-[#2F3A35]">
                      {subtaskProgress}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#E9EFEC] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${subtaskProgress}%`,
                        backgroundColor:
                          subtaskProgress === 100
                            ? "#10B981"
                            : subtaskProgress > 50
                            ? "#3B82F6"
                            : "#F59E0B",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* AI Synthesize Button */}
              <div className="flex justify-center pb-2">
                <button
                  onClick={synthesizeSubtasks}
                  disabled={isSynthesizing}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7C9A8B] to-[#5F7D6E] text-white text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSynthesizing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isSynthesizing ? "Generating..." : "AI Generate Checklist"}
                </button>
              </div>

              {/* Subtask List */}
              <div className="space-y-2">
                {task.subtasks.length > 0 ? (
                  task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all group",
                        subtask.completed
                          ? "bg-[#F4F7F5] border-[#E9EFEC]"
                          : "bg-white border-[#E9EFEC] hover:border-[#7C9A8B]/30 hover:shadow-sm"
                      )}
                    >
                      <button
                        onClick={() => toggleSubtask(subtask.id, subtask.completed)}
                        className="shrink-0 cursor-pointer hover:scale-110 transition-transform"
                      >
                        {subtask.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                        ) : (
                          <Circle className="w-6 h-6 text-[#DDE5E1] hover:text-[#7C9A8B]" />
                        )}
                      </button>
                      <span
                        className={cn(
                          "flex-1 text-sm font-medium",
                          subtask.completed
                            ? "line-through text-[#AFC8B8]"
                            : "text-[#2F3A35]"
                        )}
                      >
                        {subtask.title}
                      </span>
                      <button
                        onClick={() => deleteSubtask(subtask.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-[#AFC8B8] hover:text-red-500 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#F4F7F5] flex items-center justify-center">
                      <ListChecks className="w-8 h-8 text-[#AFC8B8]" />
                    </div>
                    <p className="text-sm text-[#8A9E96] font-medium">No subtasks yet</p>
                    <p className="text-xs text-[#AFC8B8] mt-1">
                      Break down this task into smaller steps
                    </p>
                  </div>
                )}
              </div>

              {/* Add Subtask Input */}
              <div className="flex items-center gap-2 pt-2">
                <div className="flex-1 relative">
                  <input
                    ref={subtaskInputRef}
                    type="text"
                    placeholder="Add a subtask... (Press Enter)"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, addSubtask)}
                    className="w-full h-12 bg-white border-2 border-[#DDE5E1] focus:border-[#7C9A8B] rounded-xl px-4 pl-11 text-sm text-[#2F3A35] outline-none transition-all placeholder:text-[#AFC8B8]"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFC8B8]">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
                <button
                  onClick={addSubtask}
                  disabled={!newSubtaskTitle.trim() || isSubmittingSubtask}
                  className="h-12 px-5 rounded-xl bg-[#7C9A8B] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#5F7D6E] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {isSubmittingSubtask ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Add
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Comments List */}
              <div className="space-y-3">
                {loadingComments ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#AFC8B8] animate-spin" />
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 p-4 bg-white rounded-xl border border-[#E9EFEC]"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#E9EFEC] flex items-center justify-center text-sm font-bold text-[#7C9A8B] shrink-0">
                        {comment.authorImage ? (
                          <img
                            src={comment.authorImage}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          getInitials(comment.authorName)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-[#2F3A35]">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-[#AFC8B8]">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-[#5C6B64] leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#F4F7F5] flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-[#AFC8B8]" />
                    </div>
                    <p className="text-sm text-[#8A9E96] font-medium">No comments yet</p>
                    <p className="text-xs text-[#AFC8B8] mt-1">
                      Start the conversation about this task
                    </p>
                  </div>
                )}
              </div>

              {/* Add Comment Input */}
              <div className="pt-2">
                <div className="relative">
                  <textarea
                    ref={commentInputRef}
                    placeholder="Write a comment or note... (Press Enter to submit)"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        addComment();
                      }
                    }}
                    rows={3}
                    className="w-full bg-white border-2 border-[#DDE5E1] focus:border-[#7C9A8B] rounded-xl px-4 py-3 text-sm text-[#2F3A35] outline-none transition-all placeholder:text-[#AFC8B8] resize-none"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={addComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C9A8B] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#5F7D6E] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmittingComment ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post Comment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E9EFEC] bg-white flex items-center justify-between">
          <div className="text-xs text-[#8A9E96]">
            Created recently • ID: {task.id.slice(0, 8)}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#F4F7F5] text-[#5C6B64] font-bold uppercase tracking-wider text-xs hover:bg-[#E9EFEC] transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
