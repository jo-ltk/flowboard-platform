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
  Activity
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

export function TaskManagement() {
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
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        console.warn("Projects API returned", res.status);
        return;
      }
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
      console.log("[TaskManagement] Fetching tasks from real DB...");
      const res = await fetch("/api/dashboard/tasks");
      if (!res.ok) {
        console.error("Tasks API returned", res.status);
        toast.error("Failed to load tasks (server error)");
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("Failed to fetch tasks:", data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to connect to task database");
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
    // Optimistic update
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
      toast.success(`Task marked as ${nextStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
      fetchTasks(); // Revert
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
      toast.success("Task is now in progress");
    } catch (err) {
      toast.error("Failed to update status");
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
      toast.info(isEditing ? "Updating task..." : "Creating task...");
      
      const res = await fetch("/api/dashboard/tasks", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { ...taskData, id: editingTask.id } : taskData)
      });

      if (res.ok) {
        toast.success(isEditing ? "Task updated!" : "Task created in database!");
        setEditingTask(null);
        fetchTasks(); // Refresh
      } else {
        throw new Error("Failed to process task");
      }
    } catch (error) {
      toast.error("Could not save changes to database");
      throw error;
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const id = taskToDelete.id;
      // Optimistic update
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.info("Deleting task...");

      const res = await fetch(`/api/dashboard/tasks?id=${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      fetchTasks(); // Revert
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
        <Loader2 className="w-10 h-10 text-soft-blue animate-spin" />
        <p className="font-mono text-xs font-bold text-deep-blue/40 uppercase tracking-widest">Synchronizing Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full">
      {/* Search & Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-6 items-stretch xl:items-center justify-between pb-8 border-b border-border-soft">
        {/* Search Input - Full width on small/medium, fixed max-width on XL */}
        <div className="relative w-full xl:max-w-md group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-blue/20 group-focus-within:text-soft-blue transition-colors" />
          <input 
            type="text"
            placeholder="SEARCH ALL TASKS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 h-14 rounded-2xl bg-surface-sunken/40 border-2 border-transparent focus:border-soft-blue/20 focus:bg-white transition-all outline-hidden text-sm font-bold shadow-[inset_0_2px_4px_rgba(54,76,132,0.03)] placeholder:text-deep-blue/20 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.2em]"
          />
        </div>
        
        {/* Filters and CTA Group */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
          {/* Filters Grid - 2 columns on mobile/tablet */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1 xl:flex xl:items-center">
            {/* Status Filter Button */}
            <div className="relative h-14 bg-white border-2 border-border-soft rounded-2xl px-4 sm:px-5 shadow-soft hover:shadow-medium hover:border-soft-blue/30 transition-all duration-300 flex items-center group cursor-pointer xl:min-w-[180px]">
              <Filter className="shrink-0 w-4 h-4 text-deep-blue/20 mr-2 sm:mr-3 group-hover:text-soft-blue transition-colors" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-transparent text-[10px] sm:text-[11px] font-black text-deep-blue/40 uppercase tracking-[0.15em] sm:tracking-[0.2em] outline-hidden cursor-pointer pr-6 sm:pr-8 w-full"
              >
                <option value="ALL">ALL STATUS</option>
                <option value="TODO">TO DO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
              <ChevronDown className="absolute right-4 sm:right-5 w-4 h-4 text-deep-blue/10 group-hover:text-deep-blue/30 transition-colors pointer-events-none" />
            </div>

            {/* Priority Filter Button */}
            <div className="relative h-14 bg-white border-2 border-border-soft rounded-2xl px-4 sm:px-5 shadow-soft hover:shadow-medium hover:border-soft-blue/30 transition-all duration-300 flex items-center group cursor-pointer xl:min-w-[180px]">
              <Tag className="shrink-0 w-4 h-4 text-deep-blue/20 mr-2 sm:mr-3 group-hover:text-soft-blue transition-colors" />
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="appearance-none bg-transparent text-[10px] sm:text-[11px] font-black text-deep-blue/40 uppercase tracking-[0.15em] sm:tracking-[0.2em] outline-hidden cursor-pointer pr-6 sm:pr-8 w-full"
              >
                <option value="ALL">ALL PRIORITY</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
              <ChevronDown className="absolute right-4 sm:right-5 w-4 h-4 text-deep-blue/10 group-hover:text-deep-blue/30 transition-colors pointer-events-none" />
            </div>
          </div>

          {/* New Task Button - Full width on mobile, auto on desktop */}
          <button 
            onClick={addTask}
            className="sm:w-auto h-14 px-8 rounded-2xl bg-deep-blue text-cream hover:bg-deep-blue-dark transition-all duration-500 shadow-glow-blue hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Plus className="w-5 h-5 text-light-green group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">New Task</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div 
              key={task.id}
              className={cn(
                "group relative bg-white border border-border-soft rounded-2xl p-6 transition-all duration-300 hover:shadow-elevated hover:border-soft-blue/20 flex flex-col md:flex-row md:items-center gap-6",
                task.status === "COMPLETED" && "opacity-60 grayscale-[0.5]"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={() => toggleTaskStatus(task.id)}
                  className="shrink-0 cursor-pointer"
                >
                  {task.status === "COMPLETED" ? (
                    <CheckCircle2 className="w-6 h-6 text-light-green fill-light-green/10" />
                  ) : (
                    <Circle className="w-6 h-6 text-deep-blue/10 group-hover:text-soft-blue transition-colors" />
                  )}
                </button>
                {task.status === "TODO" && (
                  <button 
                    onClick={() => setInProgress(task.id)}
                    className="shrink-0 w-6 h-6 rounded-full border border-blue-100 flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all cursor-pointer"
                    title="Start Working"
                  >
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className={cn(
                    "font-syne text-lg font-bold text-deep-blue leading-none",
                    task.status === "COMPLETED" && "line-through text-deep-blue/40"
                  )}>
                    {task.title}
                  </h3>
                  <Badge className={cn(
                    "text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border-none shadow-sm",
                    task.priority === "HIGH" ? "bg-red-100 text-red-600" :
                    task.priority === "MEDIUM" ? "bg-amber-100 text-amber-600" :
                    "bg-blue-100 text-blue-600"
                  )}>
                    {task.priority}
                  </Badge>
                  {task.status === "IN_PROGRESS" && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 animate-pulse">
                      <Activity className="w-2.5 h-2.5" />
                      <span className="text-[8px] font-black uppercase tracking-wider">Working</span>
                    </div>
                  )}
                </div>
                {task.description && (
                  <p className="text-sm text-deep-blue/50 font-medium line-clamp-1 max-w-2xl">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-soft-blue/10 flex items-center justify-center border border-soft-blue/5">
                    <User className="w-3.5 h-3.5 text-soft-blue" />
                  </div>
                  <span className="text-xs font-bold text-deep-blue/60">{task.assignee}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center border border-border-soft">
                    <Calendar className="w-3.5 h-3.5 text-deep-blue/30" />
                  </div>
                  <span className="text-xs font-bold text-deep-blue/60">{task.dueDate}</span>
                </div>

                <Badge variant="outline" className="h-8 border-border-soft text-[10px] font-bold text-deep-blue/40 uppercase tracking-widest bg-surface-primary/20 backdrop-blur-sm">
                  {task.project}
                </Badge>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => editTask(task)}
                    className="h-10 px-4 rounded-xl bg-surface-sunken/50 hover:bg-soft-blue/10 text-deep-blue/40 hover:text-soft-blue border border-transparent hover:border-soft-blue/20 transition-all duration-300 cursor-pointer flex items-center gap-2 group/edit"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/edit:translate-x-0.5 group-hover/edit:-translate-y-0.5 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Edit</span>
                  </button>
                  
                  <button 
                    onClick={(e) => openDeleteModal(task, e)}
                    className="h-10 w-10 rounded-xl bg-surface-sunken/50 hover:bg-red-50 text-deep-blue/40 hover:text-red-500 border border-transparent hover:border-red-200 transition-all duration-300 cursor-pointer flex items-center justify-center group/delete"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-surface-sunken/20 rounded-[40px] border border-dashed border-border-soft">
            <div className="p-6 rounded-full bg-white shadow-soft">
              <Search className="w-8 h-8 text-deep-blue/10" />
            </div>
            <div className="space-y-1">
              <h3 className="font-syne text-xl font-bold text-deep-blue">Pulse flatlining...</h3>
              <p className="text-deep-blue/40 text-sm max-w-xs mx-auto">
                Your filters are too restrictive. Try broadening your horizon.
              </p>
            </div>
            <button 
              onClick={() => {setSearchQuery(""); setStatusFilter("ALL"); setPriorityFilter("ALL");}}
              className="text-xs font-bold text-soft-blue uppercase tracking-widest hover:underline cursor-pointer"
            >
              Reset filters
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
