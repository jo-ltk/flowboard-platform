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
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
  assignee: string;
  project: string;
}

export function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      console.log("[TaskManagement] Fetching tasks from real DB...");
      const res = await fetch("/api/dashboard/tasks");
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

    toast.success(`Task status updated to ${nextStatus}`);
    console.log(`[TaskManagement] Task ${id} updated status to ${nextStatus}`);
    
    // In a real app, you'd call a PATCH API here
  };

  const addTask = async () => {
    const title = prompt("Enter task title:");
    if (!title) return;

    try {
      toast.info("Creating task...");
      const res = await fetch("/api/dashboard/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });

      if (res.ok) {
        toast.success("Task created in database!");
        fetchTasks(); // Refresh
      } else {
        throw new Error("Failed to create task");
      }
    } catch (error) {
      toast.error("Could not save task to database");
    }
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
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-2 border-b border-border-soft">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-blue/30 group-focus-within:text-soft-blue transition-colors" />
          <input 
            type="text"
            placeholder="Search all tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface-sunken/50 border border-transparent focus:border-soft-blue/30 focus:bg-white transition-all outline-hidden text-sm font-medium shadow-inner"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white border border-border-soft rounded-2xl px-3 py-1.5 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-deep-blue/40" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-deep-blue/60 uppercase tracking-widest outline-hidden cursor-pointer"
            >
              <option value="ALL">Status: All</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white border border-border-soft rounded-2xl px-3 py-1.5 shadow-sm">
            <Tag className="w-3.5 h-3.5 text-deep-blue/40" />
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-deep-blue/60 uppercase tracking-widest outline-hidden cursor-pointer"
            >
              <option value="ALL">Priority: All</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <button 
            onClick={addTask}
            className="ml-auto md:ml-0 bg-deep-blue text-cream p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-deep-blue/20 cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden lg:inline pr-2">New Task</span>
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
              {/* Status Toggle */}
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

                <button className="p-2 rounded-xl hover:bg-surface-sunken text-deep-blue/20 hover:text-deep-blue/60 transition-colors cursor-pointer">
                  <MoreVertical className="w-4 h-4" />
                </button>
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
    </div>
  );
}
