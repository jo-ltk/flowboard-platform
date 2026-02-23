"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Calendar,
  User,
  Tag,
  ArrowUpRight,
  ChevronDown,
  Loader2,
  X,
  Trash2,
  Play,
  Activity,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { TaskModal } from "./TaskModal";
import { DeleteTaskModal } from "./DeleteTaskModal";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
  assignee: string;
  project: string;
  projectId: string;
}

interface Project {
  id: string;
  name: string;
}

import { useWorkspaces } from "@/context/WorkspaceContext";

export function TaskManagement() {
  const { activeWorkspace } = useWorkspaces();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (activeWorkspace?.id) {
      setTasks([]);
      fetchTasks();
      fetchProjects();
    }
  }, [activeWorkspace?.id]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchTasks();
    };
    window.addEventListener("refresh-tasks", handleRefresh);
    return () => window.removeEventListener("refresh-tasks", handleRefresh);
  }, [activeWorkspace?.id]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects?workspaceId=${activeWorkspace.id}`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/dashboard/tasks?workspaceId=${activeWorkspace.id}`);
      if (!res.ok) {
        toast.error("Failed to load tasks");
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (error) {
      toast.error("Failed to connect to database");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const toggleTaskStatus = async (id: string) => {
    let nextStatus: any = "";
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        nextStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
        return { ...task, status: nextStatus };
      }
      return task;
    }));

    try {
      await fetch(`/api/dashboard/tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      toast.success(nextStatus === "COMPLETED" ? "Focus Area Harmonized" : "Discovery Reopened");
    } catch (err) {
      toast.error("Status update failed");
      fetchTasks();
    }
  };

  const setInProgress = async (id: string) => {
    try {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "IN_PROGRESS" } : t));
      const res = await fetch(`/api/dashboard/tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: "IN_PROGRESS" })
      });
      if (!res.ok) throw new Error();
      toast.success("Begin your flow");
    } catch (err) {
      toast.error("Status update failed");
      fetchTasks();
    }
  };

  const handleConfirmTask = async (taskData: { 
    title: string; 
    description: string; 
    status: string; 
    priority: string; 
    dueDate?: string;
    projectId?: string;
  }) => {
    try {
      const isEditing = !!editingTask;
      const res = await fetch("/api/dashboard/tasks", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { ...taskData, id: editingTask.id } : taskData)
      });

      if (res.ok) {
        toast.success(isEditing ? "Updated" : "Created");
        setEditingTask(null);
        fetchTasks();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Could not save focus area");
      throw error;
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const id = taskToDelete.id;
      setTasks(prev => prev.filter(t => t.id !== id));
      const res = await fetch(`/api/dashboard/tasks?id=${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error();
      toast.success("Removed successfully");
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

  const editTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-8 h-8 text-[#7C9A8B] animate-spin" />
        <p className="text-[10px] font-bold text-[#8A9E96] uppercase tracking-[0.2em]">Gathering Flow...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full pb-10">
      {/* Search & Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-5 items-stretch xl:items-center justify-between pb-6 border-b border-[#DDE5E1]">
        {/* Search Input */}
        <div className="relative w-full xl:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AFC8B8] group-focus-within:text-[#7C9A8B] transition-colors" />
          <input 
            type="text"
            placeholder="Search objectives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 h-11 rounded-xl bg-white border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 transition-all outline-hidden text-sm font-medium placeholder:text-[#AFC8B8] placeholder:font-light"
          />
        </div>
        
        {/* Filters and CTA Group */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          <div className="grid grid-cols-2 gap-3 flex-1 xl:flex xl:items-center">
            {/* Status Filter */}
            <div className="relative h-11 bg-white border border-[#DDE5E1] rounded-xl px-4 hover:border-[#AFC8B8] transition-all flex items-center group cursor-pointer xl:min-w-[170px]">
              <Filter className="shrink-0 w-3.5 h-3.5 text-[#AFC8B8] mr-2.5 group-hover:text-[#7C9A8B]" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-transparent text-[11px] font-bold text-[#5C6B64] uppercase tracking-wider outline-hidden cursor-pointer pr-6 w-full"
              >
                <option value="ALL">Status</option>
                <option value="TODO">Discovery</option>
                <option value="IN_PROGRESS">Flowing</option>
                <option value="COMPLETED">Harmonized</option>
              </select>
              <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-[#AFC8B8] pointer-events-none" />
            </div>

            {/* Priority Filter */}
            <div className="relative h-11 bg-white border border-[#DDE5E1] rounded-xl px-4 hover:border-[#AFC8B8] transition-all flex items-center group cursor-pointer xl:min-w-[170px]">
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
          </div>

          <button 
            onClick={addTask}
            className="sm:w-auto h-11 px-6 rounded-xl bg-[#7C9A8B] text-white hover:bg-[#5F7D6E] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-widest">New Focus</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3.5">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div 
              key={task.id}
              className={cn(
                "group relative bg-white border border-[#DDE5E1]  p-5 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-[#AFC8B8] flex flex-col md:flex-row md:items-center gap-5",
                task.status === "COMPLETED" && "opacity-50"
              )}
            >
              <div className="flex md:flex-col items-center gap-2">
                <button 
                  onClick={() => toggleTaskStatus(task.id)}
                  className="shrink-0 cursor-pointer overflow-hidden transition-transform active:scale-95"
                >
                  {task.status === "COMPLETED" ? (
                    <CheckCircle2 className="w-6 h-6 text-[#7C9A8B]" />
                  ) : (
                    <Circle className="w-6 h-6 text-[#DDE5E1] group-hover:text-[#AFC8B8]" />
                  )}
                </button>
                {task.status === "TODO" && (
                  <button 
                    onClick={() => setInProgress(task.id)}
                    className="shrink-0 w-6 h-6 rounded-full border border-[#7C9A8B]/20 flex items-center justify-center text-[#7C9A8B] hover:bg-[#7C9A8B] hover:text-white transition-all cursor-pointer"
                    title="Begin Flow"
                  >
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-3">
                  <h3 className={cn(
                    "text-base font-bold text-[#2F3A35] leading-tight",
                    task.status === "COMPLETED" && "italic text-[#8A9E96]"
                  )}>
                    {task.title}
                  </h3>
                  <Badge className={cn(
                    "text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-transparent",
                    task.priority === "HIGH" ? "bg-red-50 text-red-600 border-red-100" :
                    task.priority === "MEDIUM" ? "bg-orange-50 text-orange-600 border-orange-100" :
                    "bg-[#F4F7F5] text-[#7C9A8B] border-[#DDE5E1]"
                  )}>
                    {task.priority}
                  </Badge>
                  {task.status === "IN_PROGRESS" && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#AFC8B8]/15 text-[#5F7D6E] border border-[#AFC8B8]/30 animate-pulse">
                      <Activity className="w-2.5 h-2.5" />
                      <span className="text-[8px] font-bold uppercase tracking-wider">Flowing</span>
                    </div>
                  )}
                </div>
                {task.description && (
                  <p className="text-[13px] text-[#8A9E96] font-light leading-relaxed line-clamp-1 max-w-2xl">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E9EFEC] flex items-center justify-center border border-white text-[10px] font-bold text-[#7C9A8B]">
                    {task.assignee[0]}
                  </div>
                  <span className="text-xs font-semibold text-[#5C6B64]">{task.assignee}</span>
                </div>

                <div className="flex items-center gap-2">
                   <Calendar className="w-3.5 h-3.5 text-[#AFC8B8]" />
                   <span className="text-xs font-semibold text-[#8A9E96]">{task.dueDate}</span>
                </div>

                <Badge variant="outline" className="h-7 border-[#DDE5E1] text-[9px] font-bold text-[#8A9E96] uppercase tracking-wider bg-[#F4F7F5]/30">
                  {task.project}
                </Badge>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => editTask(task)}
                    className="h-9 px-3.5 rounded-lg bg-white hover:bg-[#F4F7F5] text-[#8A9E96] hover:text-[#5C6B64] border border-[#DDE5E1] transition-all cursor-pointer flex items-center gap-2 group/edit"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/edit:translate-x-0.5 group-hover/edit:-translate-y-0.5 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Edit</span>
                  </button>
                  
                  <button 
                    onClick={(e) => openDeleteModal(task, e)}
                    className="h-9 w-9 rounded-lg bg-white hover:bg-red-50 text-[#8A9E96] hover:text-red-500 border border-[#DDE5E1] hover:border-red-100 transition-all cursor-pointer flex items-center justify-center group/delete"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-5 bg-[#F4F7F5]/50 rounded-3xl border border-dashed border-[#AFC8B8]">
            <div className="p-6 rounded-full bg-white shadow-sm border border-[#DDE5E1]">
              <Sparkles className="w-8 h-8 text-[#AFC8B8]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[#2F3A35]">Perfectly Clear</h3>
              <p className="text-[#8A9E96] text-sm font-light max-w-xs mx-auto">
                No focus areas found. Enjoy the clarity or refine your search.
              </p>
            </div>
            <button 
              onClick={() => {setSearchQuery(""); setStatusFilter("ALL"); setPriorityFilter("ALL");}}
              className="text-xs font-bold text-[#7C9A8B] uppercase tracking-widest hover:text-[#5F7D6E] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onConfirm={handleConfirmTask}
        initialData={editingTask ? {
          title: editingTask.title,
          description: editingTask.description,
          status: editingTask.status,
          priority: editingTask.priority,
          dueDate: editingTask.dueDate,
          projectId: editingTask.projectId
        } : undefined}
        projects={projects}
      />
      
      <DeleteTaskModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteTask}
        taskTitle={taskToDelete?.title}
      />
    </div>
  );
}
