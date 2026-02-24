"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  CheckCircle2,
  Circle,
  Search,
  Plus,
  Filter,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Loader2,
  X,
  Trash2,
  Play,
  Pause,
  Ban,
  Activity,
  Sparkles,
  UserCircle,
  MessageSquare,
  ListChecks,
  Send,
  MoreHorizontal,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { TaskModal } from "./TaskModal";
import { DeleteTaskModal } from "./DeleteTaskModal";
import { TaskDetailModal } from "./TaskDetailModal";
import { useWorkspaces } from "@/context/WorkspaceContext";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

/* ═══════════════════════════════════════════
   Status Configuration — Pipeline Stages
   ═══════════════════════════════════════════ */

const PIPELINE_STAGES = [
  {
    key: "NOT_STARTED",
    label: "Not Started",
    shortLabel: "Step 1",
    icon: Circle,
    color: "#8A9E96",
    bg: "#F4F7F5",
    border: "#DDE5E1",
    accent: "#AFC8B8",
    description: "Queued and waiting",
  },
  {
    key: "ON_HOLD",
    label: "On Hold",
    shortLabel: "Step 2",
    icon: Pause,
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    accent: "#F59E0B",
    description: "Paused temporarily",
  },
  {
    key: "IN_PROGRESS",
    label: "In Progress",
    shortLabel: "Step 3",
    icon: Activity,
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    accent: "#3B82F6",
    description: "Actively being worked on",
  },
  {
    key: "COMPLETED",
    label: "Completed",
    shortLabel: "Step 4",
    icon: CheckCircle2,
    color: "#059669",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    accent: "#10B981",
    description: "Finished successfully",
  },
  {
    key: "SUSPENDED",
    label: "Suspended",
    shortLabel: "Step 5",
    icon: AlertCircle,
    color: "#9333EA",
    bg: "#FAF5FF",
    border: "#DDD6FE",
    accent: "#A855F7",
    description: "Put on indefinite hold",
  },
  {
    key: "CANCELLED",
    label: "Cancelled",
    shortLabel: "Step 6",
    icon: XCircle,
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    accent: "#EF4444",
    description: "No longer pursuing",
  },
] as const;

const STAGE_MAP = Object.fromEntries(PIPELINE_STAGES.map((s) => [s.key, s]));

/* ═══════════════════════════════════════════
   Interfaces
   ═══════════════════════════════════════════ */

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
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

interface Project {
  id: string;
  name: string;
}

interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
}

interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorImage: string | null;
  createdAt: string;
}

/* ═══════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════ */

export function TaskManagement() {
  const { activeWorkspace } = useWorkspaces();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");
  const [showHiddenStages, setShowHiddenStages] = useState(false);

  // Subtask + Comment state for expanded task
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState<string | null>(null);

  // Task Detail Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (activeWorkspace?.id) {
      setTasks([]);
      fetchTasks();
      fetchProjects();
      fetchMembers();
    }
  }, [activeWorkspace?.id]);

  useEffect(() => {
    const handleRefresh = () => fetchTasks(true);
    window.addEventListener("refresh-tasks", handleRefresh);
    return () => window.removeEventListener("refresh-tasks", handleRefresh);
  }, [activeWorkspace?.id]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects?workspaceId=${activeWorkspace?.id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/team?workspaceId=${activeWorkspace?.id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchTasks = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const res = await fetch(`/api/dashboard/tasks?workspaceId=${activeWorkspace?.id}`);
      if (!res.ok) {
        if (!silent) toast.error("Failed to load tasks");
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (error) {
      if (!silent) toast.error("Failed to connect to database");
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

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

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
      const matchesAssignee =
        assigneeFilter === "ALL" ||
        (assigneeFilter === "UNASSIGNED" ? !task.assigneeId : task.assigneeId === assigneeFilter);
      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchQuery, priorityFilter, assigneeFilter]);

  const tasksByStage = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    PIPELINE_STAGES.forEach((s) => (grouped[s.key] = []));
    filteredTasks.forEach((t) => {
      if (grouped[t.status]) grouped[t.status].push(t);
      else grouped["NOT_STARTED"].push(t);
    });
    return grouped;
  }, [filteredTasks]);

  const updateTaskStatus = async (id: string, status: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      const res = await fetch(`/api/dashboard/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Task moved to ${STAGE_MAP[status]?.label || status}`);
    } catch (err) {
      toast.error("Status update failed");
      fetchTasks();
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskId = draggableId;
    const newStatus = destination.droppableId;
    const oldStatus = source.droppableId;

    if (newStatus !== oldStatus) {
      // Optimistically update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      
      try {
        const res = await fetch("/api/dashboard/tasks", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: taskId, status: newStatus }),
        });
        if (res.ok) {
          toast.success("Task updated");
        } else {
          throw new Error("Update failed");
        }
      } catch (error) {
        toast.error("Failed to update status");
        // Revert on failure
        fetchTasks();
      }
    }
  };

  const toggleSubtask = async (subtaskId: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/dashboard/subtasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: subtaskId, completed: !completed }),
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (e) {
      toast.error("Failed to update subtask");
    }
  };

  const addSubtask = async (taskId: string) => {
    if (!newSubtaskTitle.trim()) return;
    try {
      const res = await fetch(`/api/dashboard/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newSubtaskTitle, taskId }),
      });
      if (res.ok) {
        setNewSubtaskTitle("");
        fetchTasks();
        toast.success("Subtask added");
      }
    } catch (e) {
      toast.error("Failed to add subtask");
    }
  };

  const deleteSubtask = async (subtaskId: string) => {
    try {
      const res = await fetch(`/api/dashboard/subtasks?id=${subtaskId}`, { method: "DELETE" });
      if (res.ok) {
        fetchTasks();
        toast.success("Subtask removed");
      }
    } catch (e) {
      toast.error("Failed to remove subtask");
    }
  };

  const addComment = async (taskId: string) => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`/api/dashboard/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          taskId,
          authorName: "You",
        }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments(taskId);
        fetchTasks();
        toast.success("Comment added");
      }
    } catch (e) {
      toast.error("Failed to add comment");
    }
  };

  const synthesizeSubtasks = async (task: Task) => {
    try {
      setIsSynthesizing(task.id);
      const res = await fetch("/api/ai/subtasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          taskId: task.id, 
          title: task.title, 
          description: task.description 
        }),
      });
      
      if (!res.ok) throw new Error("AI Synthesis failed");
      
      const data = await res.json();
      toast.success("AI synthesized new checklist");
      
      // Create updated task with the new subtasks from the response
      const updatedTask = {
        ...task,
        subtasks: data.subtasks,
        subtaskTotal: data.subtasks.length,
        subtaskCompleted: 0,
      };
      
      // Update the selected task so the modal shows the new subtasks immediately
      setSelectedTask(updatedTask);
      
      // Also refresh the tasks list
      fetchTasks();
    } catch (err) {
      toast.error("AI Neural mapping failed");
    } finally {
      setIsSynthesizing(null);
    }
  };

  const handleConfirmTask = async (taskData: {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate?: string;
    projectId?: string;
    assigneeId?: string;
  }) => {
    try {
      const isEditing = !!editingTask;
      const res = await fetch("/api/dashboard/tasks", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { ...taskData, id: editingTask.id } : taskData),
      });
      if (res.ok) {
        toast.success(isEditing ? "Task updated" : "Task created");
        setEditingTask(null);
        fetchTasks();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Could not save task");
      throw error;
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      const id = taskToDelete.id;
      setTasks((prev) => prev.filter((t) => t.id !== id));
      const res = await fetch(`/api/dashboard/tasks?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Task removed");
    } catch (error) {
      toast.error("Failed to remove");
      fetchTasks();
    } finally {
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const openDeleteModal = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const addTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const editTask = (task: Task, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const toggleExpand = (task: Task) => {
    // Open the detail modal instead of expanding inline
    setSelectedTask(task);
    setIsDetailModalOpen(true);
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

  /* ─── Loading State ─── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-8 h-8 text-[#7C9A8B] animate-spin" />
        <p className="text-[10px] font-bold text-[#8A9E96] uppercase tracking-[0.2em]">
          Loading pipeline...
        </p>
      </div>
    );
  }

  /* ─── Subtask Progress Bar ─── */
  const SubtaskProgress = ({ task }: { task: Task }) => {
    if (task.subtaskTotal === 0) return null;
    const pct = Math.round((task.subtaskCompleted / task.subtaskTotal) * 100);

    return (
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center gap-1.5">
          <ListChecks className="w-3 h-3 text-[#8A9E96]" />
          <span className="text-[10px] font-semibold text-[#5C6B64] whitespace-nowrap">
            {task.subtaskCompleted}/{task.subtaskTotal}
          </span>
        </div>
        <div className="flex-1 h-1.5 bg-[#E9EFEC] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background:
                pct === 100
                  ? "#10B981"
                  : pct > 50
                  ? "#3B82F6"
                  : "#F59E0B",
            }}
          />
        </div>
        <span className="text-[10px] font-bold text-[#8A9E96] min-w-[32px] text-right">
          {pct}%
        </span>
      </div>
    );
  };

  /* ═══════════════════════════════ TASK CARD ═══════════════════════════════ */
  const TaskCard = ({ task, index }: { task: Task; index?: number }) => {
    const stage = STAGE_MAP[task.status] || STAGE_MAP["NOT_STARTED"];
    const isExpanded = expandedTask === task.id;

    const CardContent = (
      <>
        {/* Card Header */}
        <div
          className="p-4 cursor-pointer"
          onClick={() => toggleExpand(task)}
        >
          {/* Priority + Status Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: stage.accent }}
              />
              <Badge
                className={cn(
                  "text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-transparent",
                  task.priority === "HIGH"
                    ? "bg-red-50 text-red-600 border-red-100"
                    : task.priority === "MEDIUM"
                    ? "bg-orange-50 text-orange-600 border-orange-100"
                    : "bg-[#F4F7F5] text-[#7C9A8B] border-[#DDE5E1]"
                )}
              >
                {task.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => editTask(task, e)}
                className="h-7 w-7 rounded-lg hover:bg-[#F4F7F5] text-[#8A9E96] hover:text-[#5C6B64] transition-all cursor-pointer flex items-center justify-center"
              >
                <ArrowUpRight className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => openDeleteModal(task, e)}
                className="h-7 w-7 rounded-lg hover:bg-red-50 text-[#8A9E96] hover:text-red-500 transition-all cursor-pointer flex items-center justify-center"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "text-sm font-semibold text-[#2F3A35] leading-snug mb-2",
              task.status === "COMPLETED" && "line-through text-[#8A9E96]",
              task.status === "CANCELLED" && "line-through text-[#C4C4C4]"
            )}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-[11px] text-[#8A9E96] font-light leading-relaxed line-clamp-2 mb-3">
              {task.description}
            </p>
          )}

          {/* Subtask Progress */}
          <SubtaskProgress task={task} />

          {/* Footer: Assignee, Date, Comments */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F4F7F5]">
            <div className="flex items-center gap-2">
              {task.assigneeImage ? (
                <img
                  src={task.assigneeImage}
                  alt={task.assignee}
                  className="w-5 h-5 rounded-full object-cover border border-[#DDE5E1]"
                />
              ) : (
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold",
                    task.assigneeId
                      ? "bg-[#E9EFEC] text-[#7C9A8B]"
                      : "bg-[#F4F7F5] text-[#AFC8B8] border border-dashed border-[#DDE5E1]"
                  )}
                >
                  {getInitials(task.assignee)}
                </div>
              )}
              <span className="text-[10px] font-medium text-[#8A9E96] truncate max-w-[80px]">
                {task.assignee}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {task.dueDate !== "No date" && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 text-[#AFC8B8]" />
                  <span className="text-[9px] font-medium text-[#8A9E96]">{task.dueDate}</span>
                </div>
              )}
              {task.commentCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-2.5 h-2.5 text-[#AFC8B8]" />
                  <span className="text-[9px] font-medium text-[#8A9E96]">{task.commentCount}</span>
                </div>
              )}
              <ChevronRight
                className={cn(
                  "w-3 h-3 text-[#AFC8B8] transition-transform duration-300",
                  isExpanded && "rotate-90"
                )}
              />
            </div>
          </div>
        </div>

        {/* ─── Expanded Detail Panel ─── */}
        {isExpanded && (
          <div className="border-t border-[#DDE5E1] animate-in slide-in-from-top-2 duration-300">
            {/* Status Actions */}
            <div className="p-4 border-b border-[#F4F7F5] bg-[#FAFCFB]">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#8A9E96] mb-2.5">
                Move to
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PIPELINE_STAGES.filter((s) => s.key !== task.status).map((s) => (
                  <button
                    key={s.key}
                    onClick={() => updateTaskStatus(task.id, s.key)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[9px] font-semibold transition-all cursor-pointer hover:shadow-sm"
                    style={{
                      color: s.color,
                      backgroundColor: s.bg,
                      borderColor: s.border,
                    }}
                  >
                    <s.icon className="w-2.5 h-2.5" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="p-4 border-b border-[#F4F7F5]">
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#8A9E96] flex items-center gap-1.5">
                    <ListChecks className="w-3 h-3" />
                    Subtasks
                    {task.subtaskTotal > 0 && (
                      <span className="text-[#5C6B64] ml-1">
                        ({task.subtaskCompleted} of {task.subtaskTotal} completed)
                      </span>
                    )}
                  </p>
                  <button
                    onClick={() => synthesizeSubtasks(task)}
                    disabled={isSynthesizing === task.id}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-light-green/20 text-sage-deep text-[8px] font-black tracking-widest uppercase hover:bg-light-green/40 transition-all disabled:opacity-50"
                  >
                    {isSynthesizing === task.id ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-2.5 h-2.5" />
                    )}
                    <span>Synthesize</span>
                  </button>
                </div>

              {/* Existing Subtasks */}
              <div className="space-y-1 mb-3">
                {task.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-2.5 group/sub py-1.5 px-2 rounded-lg hover:bg-[#F4F7F5] transition-colors"
                  >
                    <button
                      onClick={() => toggleSubtask(sub.id, sub.completed)}
                      className="shrink-0 cursor-pointer"
                    >
                      {sub.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#DDE5E1] hover:text-[#AFC8B8]" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "text-xs flex-1",
                        sub.completed
                          ? "line-through text-[#AFC8B8]"
                          : "text-[#2F3A35] font-medium"
                      )}
                    >
                      {sub.title}
                    </span>
                    <button
                      onClick={() => deleteSubtask(sub.id)}
                      className="opacity-0 group-hover/sub:opacity-100 p-1 rounded hover:bg-red-50 text-[#AFC8B8] hover:text-red-500 transition-all cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Subtask */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSubtask(task.id)}
                  className="flex-1 bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] rounded-lg px-3 py-2 text-xs text-[#2F3A35] outline-hidden transition-all placeholder:text-[#AFC8B8]"
                />
                <button
                  onClick={() => addSubtask(task.id)}
                  disabled={!newSubtaskTitle.trim()}
                  className="h-8 w-8 rounded-lg bg-[#7C9A8B] text-white flex items-center justify-center hover:bg-sage-mid transition-all disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#8A9E96] flex items-center gap-1.5 mb-3">
                <MessageSquare className="w-3 h-3" />
                Comments & Notes
              </p>

              {/* Comment List */}
              <div className="space-y-2.5 mb-3 max-h-[200px] overflow-y-auto">
                {loadingComments ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 text-[#AFC8B8] animate-spin" />
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((c) => (
                    <div key={c.id} className="flex gap-2.5 p-2.5 rounded-lg bg-[#F4F7F5]">
                      <div className="w-6 h-6 rounded-full bg-[#E9EFEC] flex items-center justify-center text-[8px] font-bold text-[#7C9A8B] shrink-0">
                        {c.authorImage ? (
                          <img
                            src={c.authorImage}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          getInitials(c.authorName)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-semibold text-[#2F3A35]">
                            {c.authorName}
                          </span>
                          <span className="text-[9px] text-[#AFC8B8]">
                            {formatTimeAgo(c.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5C6B64] leading-relaxed">
                          {c.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-[#AFC8B8] italic text-center py-3">
                    No comments yet. Start the conversation!
                  </p>
                )}
              </div>

              {/* Add Comment */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment or note..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addComment(task.id)}
                  className="flex-1 bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] rounded-lg px-3 py-2 text-xs text-[#2F3A35] outline-hidden transition-all placeholder:text-[#AFC8B8]"
                />
                <button
                  onClick={() => addComment(task.id)}
                  disabled={!newComment.trim()}
                  className="h-8 w-8 rounded-lg bg-[#7C9A8B] text-white flex items-center justify-center hover:bg-sage-mid transition-all disabled:opacity-30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );

    if (index !== undefined) {
      return (
        <Draggable draggableId={task.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={cn(
                "group bg-white border rounded-xl transition-all duration-300",
                isExpanded
                  ? "shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-[#AFC8B8]"
                  : "shadow-[0_1px_4px_rgba(0,0,0,0.04)] border-[#DDE5E1] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#AFC8B8]",
                snapshot.isDragging && "shadow-2xl border-[#7C9A8B] ring-2 ring-[#7C9A8B]/20 z-50",
                snapshot.isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
              style={provided.draggableProps.style}
            >
              {CardContent}
            </div>
          )}
        </Draggable>
      );
    }

    // Fallback for non-draggable contexts (e.g. List view)
    return (
      <div
        className={cn(
          "group bg-white border rounded-xl transition-all duration-300",
          isExpanded
            ? "shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-[#AFC8B8]"
            : "shadow-[0_1px_4px_rgba(0,0,0,0.04)] border-[#DDE5E1] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#AFC8B8]"
        )}
      >
        {CardContent}
      </div>
    );
  };

  /* ═══════════════════════════════ PIPELINE COLUMN ═══════════════════════════════ */
  const PipelineColumn = ({ stage, tasks: columnTasks }: { stage: typeof PIPELINE_STAGES[number]; tasks: Task[] }) => {
    const StageIcon = stage.icon;
    return (
      <div className="flex flex-col min-w-[260px] xl:min-w-0 xl:w-[16.666%] flex-1 shrink-0 snap-center">
        {/* Column Header */}
        <div
          className="rounded-t-2xl px-3 py-2.5 border border-b-0 transition-colors shadow-sm relative overflow-hidden"
          style={{
            backgroundColor: stage.bg,
            borderColor: stage.border,
          }}
        >
          {/* Subtle background glow */}
          <div 
            className="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full opacity-40 pointer-events-none"
            style={{ backgroundColor: stage.accent }}
          />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shadow-xs"
                style={{ backgroundColor: `${stage.accent}22` }}
              >
                <StageIcon className="w-3.5 h-3.5" style={{ color: stage.color }} />
              </div>
              <div className="flex items-center gap-2">
                <h3
                  className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
                  style={{ color: stage.color }}
                >
                  {stage.label}
                </h3>
                <span
                  className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${stage.accent}18`,
                    color: stage.color,
                  }}
                >
                  {columnTasks.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column Body */}
        <Droppable droppableId={stage.key}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "flex-1 rounded-b-2xl border border-t-0 p-2 flex flex-col gap-2 min-h-[150px] max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide transition-colors duration-200",
                snapshot.isDraggingOver && "bg-black/5"
              )}
              style={{ borderColor: stage.border, backgroundColor: `${stage.bg}50` }}
            >
              {columnTasks.length > 0 ? (
                columnTasks.map((task, idx) => <TaskCard key={task.id} task={task} index={idx} />)
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center opacity-70">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5"
                    style={{ backgroundColor: `${stage.accent}12` }}
                  >
                    <StageIcon className="w-4 h-4" style={{ color: `${stage.accent}80` }} />
                  </div>
                  <p className="text-[10px] text-[#8A9E96] font-medium tracking-wide">No tasks</p>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };



  /* ═══════════════════════════════ SUMMARY BAR ═══════════════════════════════ */
  const SummaryBar = () => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter((t) => t.status === "COMPLETED").length;
    const inProgress = filteredTasks.filter((t) => t.status === "IN_PROGRESS").length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
      <div className="bg-white rounded-xl border border-[#DDE5E1] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8A9E96] mb-1">
              Total Tasks
            </p>
            <p className="text-2xl font-bold text-[#2F3A35]">{total}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8A9E96] mb-1">
              In Progress
            </p>
            <p className="text-2xl font-bold text-blue-600">{inProgress}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8A9E96] mb-1">
              Completed
            </p>
            <p className="text-2xl font-bold text-emerald-600">{completed}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8A9E96] mb-1">
              Completion Rate
            </p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-[#2F3A35]">{pct}%</p>
              <div className="flex-1 h-2 bg-[#E9EFEC] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#10B981] transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 h-full pb-10">
      {/* Summary Bar */}
      <SummaryBar />

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white/40 p-2.5 rounded-2xl border border-[#DDE5E1] shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AFC8B8] group-focus-within:text-[#7C9A8B] transition-colors" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 h-11 rounded-xl bg-white border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 transition-all outline-hidden text-sm font-medium placeholder:text-[#AFC8B8] placeholder:font-light"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority Filter */}
          <div className="relative h-11 bg-white border border-[#DDE5E1] rounded-xl px-4 hover:border-[#AFC8B8] transition-all flex items-center group cursor-pointer min-w-[130px]">
            <Tag className="shrink-0 w-3.5 h-3.5 text-[#AFC8B8] mr-2.5 group-hover:text-[#7C9A8B]" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none bg-transparent text-[11px] font-bold text-[#5C6B64] uppercase tracking-wider outline-hidden cursor-pointer pr-6 w-full"
            >
              <option value="ALL">Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-[#AFC8B8] pointer-events-none" />
          </div>

          {/* Assignee Filter */}
          <div className="relative h-11 bg-white border border-[#DDE5E1] rounded-xl px-4 hover:border-[#AFC8B8] transition-all flex items-center group cursor-pointer min-w-[130px]">
            <UserCircle className="shrink-0 w-3.5 h-3.5 text-[#AFC8B8] mr-2.5 group-hover:text-[#7C9A8B]" />
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="appearance-none bg-transparent text-[11px] font-bold text-[#5C6B64] uppercase tracking-wider outline-hidden cursor-pointer pr-6 w-full"
            >
              <option value="ALL">Assignee</option>
              <option value="UNASSIGNED">Unassigned</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-[#AFC8B8] pointer-events-none" />
          </div>

          {/* View Mode */}
          <div className="flex items-center bg-white border border-[#DDE5E1] rounded-xl overflow-hidden h-11 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <button
              onClick={() => setViewMode("pipeline")}
              className={cn(
                "px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer border-r border-[#DDE5E1]/50 last:border-0",
                viewMode === "pipeline"
                  ? "bg-[#2F3A35] text-white"
                  : "text-[#8A9E96] hover:text-[#5C6B64] hover:bg-[#F4F7F5]"
              )}
            >
              Pipeline
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-4 h-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer",
                viewMode === "list"
                  ? "bg-[#2F3A35] text-white"
                  : "text-[#8A9E96] hover:text-[#5C6B64] hover:bg-[#F4F7F5]"
              )}
            >
              List
            </button>
          </div>

          <button
            onClick={() => setShowHiddenStages(!showHiddenStages)}
            className={cn(
              "h-11 px-4 border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              showHiddenStages 
                ? "bg-[#D97706] text-white border-transparent shadow-md" 
                : "bg-white text-[#8A9E96] border-[#DDE5E1] hover:border-[#AFC8B8] hover:text-[#5C6B64]"
            )}
          >
            <Ban className={cn("w-3.5 h-3.5", showHiddenStages ? "text-white" : "text-[#AFC8B8]")} />
            <span className="hidden sm:inline">Hold & Dropped</span>
            <span className="sm:hidden">Hold</span>
          </button>
        </div>

        {/* Global Action */}
        <div className="xl:ml-auto">
          <button
            onClick={addTask}
            className="h-11 px-6 rounded-xl bg-[#7C9A8B] text-white hover:bg-sage-mid transition-all shadow-sm hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-widest">New Task</span>
          </button>
        </div>
      </div>

      {/* ═══════════════ PIPELINE VIEW ═══════════════ */}
      {viewMode === "pipeline" ? (
        <div className="w-full relative space-y-10">
          <DragDropContext onDragEnd={handleDragEnd}>
            {/* Archived / Hidden Stages — TOP POSITION */}
            {showHiddenStages && (
              <div className="pb-10 border-b border-[#DDE5E1] border-dashed animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-5 px-1 text-right lg:text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#D97706]/10 flex items-center justify-center">
                      <Ban className="w-4 h-4 text-[#D97706]" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-[#202925] uppercase tracking-wider">Hold & Dropped</h3>
                      <p className="text-[10px] text-[#8A9E96] font-medium italic">Secondary stages for paused or dropped workflows</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-stretch gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide max-w-full lg:max-w-[40%]">
                  {PIPELINE_STAGES.filter((stage) => 
                    ["SUSPENDED", "CANCELLED"].includes(stage.key)
                  ).map((stage) => (
                    <PipelineColumn key={stage.key} stage={stage} tasks={tasksByStage[stage.key] || []} />
                  ))}
                </div>
              </div>
            )}

            {/* Main Active Lifecycle Stages */}
            <div className="pt-2">
              {!showHiddenStages && (
                 <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A9E96] mb-6 opacity-60">Active Pipeline</p>
              )}
              <div className="flex items-stretch gap-3 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide">
                {PIPELINE_STAGES.filter((stage) => 
                  !["SUSPENDED", "CANCELLED"].includes(stage.key)
                ).map((stage) => (
                  <PipelineColumn key={stage.key} stage={stage} tasks={tasksByStage[stage.key] || []} />
                ))}
              </div>
            </div>
          </DragDropContext>
        </div>
      ) : (
        /* ═══════════════ LIST VIEW ═══════════════ */
        <div className="space-y-3">
          {PIPELINE_STAGES.map((stage) => {
            const stageTasks = tasksByStage[stage.key] || [];
            if (stageTasks.length === 0) return null;
            return (
              <div key={stage.key} className="space-y-2">
                <div className="flex items-center gap-2.5 px-1">
                  <stage.icon className="w-4 h-4" style={{ color: stage.color }} />
                  <h3
                    className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: stage.color }}
                  >
                    {stage.label}
                  </h3>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${stage.accent}18`,
                      color: stage.color,
                    }}
                  >
                    {stageTasks.length}
                  </span>
                  <div className="flex-1 h-px bg-[#E9EFEC]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {stageTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            );
          })}
          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-5 bg-[#F4F7F5]/50 rounded-3xl border border-dashed border-[#AFC8B8]">
              <div className="p-6 rounded-full bg-white shadow-sm border border-[#DDE5E1]">
                <Sparkles className="w-8 h-8 text-[#AFC8B8]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-[#2F3A35]">No tasks found</h3>
                <p className="text-[#8A9E96] text-sm font-light max-w-xs mx-auto">
                  Create your first task or adjust your filters.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPriorityFilter("ALL");
                  setAssigneeFilter("ALL");
                }}
                className="text-xs font-bold text-[#7C9A8B] uppercase tracking-widest hover:text-[#5F7D6E] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onConfirm={handleConfirmTask}
        initialData={
          editingTask
            ? {
                title: editingTask.title,
                description: editingTask.description,
                status: editingTask.status,
                priority: editingTask.priority,
                dueDate: editingTask.dueDate,
                projectId: editingTask.projectId,
                assigneeId: editingTask.assigneeId || undefined,
              }
            : undefined
        }
        projects={projects}
        members={members}
      />

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteTask}
        taskTitle={taskToDelete?.title}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onTaskUpdate={() => fetchTasks(true)}
        onTaskChange={(updatedTask) => setSelectedTask(updatedTask)}
        workspaceId={activeWorkspace?.id}
        projects={projects}
        members={members}
      />
    </div>
  );
}
