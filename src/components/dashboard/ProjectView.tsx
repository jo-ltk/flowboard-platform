"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  MoreHorizontal,
  Plus,
  Zap,
  MessageSquare,
  Clock,
  Layout,
  Calendar,
  BarChart3,
  Users
} from "lucide-react";
import { PresenceSystem } from "@/components/system/PresenceSystem";
import { ActivityFeed } from "@/components/system/ActivityFeed";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle } from "lucide-react";

export function ProjectView() {
  console.log("[ProjectView] Rendering...");

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [tasks, setTasks] = useState([
    { id: 1, title: "Finalize core design system tokens", status: "completed", priority: "high", time: "2h left", assignee: "Alex" },
    { id: 2, title: "Implement responsive dashboard sidebar", status: "in-progress", priority: "medium", time: "4h left", assignee: "Sarah" },
    { id: 3, title: "Define micro-interaction motion curves", status: "pending", priority: "low", time: "1h left", assignee: "Mike" },
    { id: 4, title: "Refactor project view for editorial aesthetic", status: "pending", priority: "high", time: "3h left", assignee: "You" },
    { id: 5, title: "Sync with stakeholders on font choices", status: "completed", priority: "medium", time: "Done", assignee: "Lisa" },
    { id: 6, title: "Update API documentation for v2", status: "pending", priority: "medium", time: "1d left", assignee: "Tom" },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`[ProjectView] Uploading file: ${file.name}`);
      setIsUploading(true);
      toast.info(`Uploading ${file.name}...`);
      
      // Simulate real upload & connection logic
      setTimeout(() => {
        setIsUploading(false);
        const newTaskId = tasks.length + 1;
        setTasks([{
          id: newTaskId,
          title: `Imported: ${file.name.split('.')[0]} Tasks`,
          status: "pending",
          priority: "high",
          time: "Just now",
          assignee: "You"
        }, ...tasks]);
        toast.success("Task file connected and uploaded successfully!");
      }, 2000);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const [phases, setPhases] = useState([
    { name: "Discovery", status: "completed", progress: 100 },
    { name: "Design", status: "in-progress", progress: 65 },
    { name: "Development", status: "pending", progress: 0 },
    { name: "Testing", status: "pending", progress: 0 },
  ]);

  const handleNewObjective = () => {
    console.log("[ProjectView] New Objective clicked");
    const newId = tasks.length + 1;
    const newTask = {
      id: newId,
      title: `New Task #${newId}`,
      status: "pending",
      priority: "medium",
      time: "Just now",
      assignee: "You"
    };
    setTasks([newTask, ...tasks]);
    toast.success("New objective created!");
  };

  const toggleTaskCompletion = (id: number) => {
    console.log(`[ProjectView] Toggling task completion for ID: ${id}`);
    setTasks(tasks.map(t => 
      t.id === id 
        ? { ...t, status: t.status === "completed" ? "pending" : "completed" } 
        : t
    ));
    toast.info("Task status updated");
  };

  const handleViewBoard = () => {
    console.log("[ProjectView] View Board clicked");
    toast("Board view coming soon!");
  };

  const handleMoreActions = () => {
    console.log("[ProjectView] More actions clicked");
    toast("More actions menu coming soon!");
  };

  const handleApplyStrategy = (index: number) => {
    console.log(`[ProjectView] Applying AI Strategy #${index}`);
    toast.success("AI Strategy applied successfully!");
  };

  return (
    <div className="space-y-8 pb-20 fade-in-up">
      {/* Editorial Header Block - Refined & Aligned */}
      <div className="relative overflow-hidden rounded-[40px] bg-linear-to-br from-deep-blue to-deep-blue/90 p-10 lg:p-14 text-cream shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-soft-blue/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-light-green/20 blur-[120px] rounded-full" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-light-green/90 backdrop-blur-md text-deep-blue border-none px-3 py-1 font-mono text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-light-green/20">
                Active Project
              </Badge>
              <div className="h-px w-8 bg-white/20" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">ID: FB-2026-004</span>
            </div>
            
            <div className="space-y-3">
              <h1 className="font-syne text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9] text-transparent bg-clip-text bg-linear-to-r from-cream via-white to-cream/80">
                Brand Identity<br />& Product Refactor
              </h1>
              <p className="text-lg text-cream/70 font-medium leading-relaxed max-w-xl">
                Complete overhaul of the digital workspace environment, focusing on architectural calmness and high-precision typography.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <PresenceSystem />
              <div className="h-4 w-px bg-white/20" />
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-deep-blue bg-surface-tinted flex items-center justify-center text-[10px] font-bold text-deep-blue">
                     U{i}
                   </div>
                 ))}
                 <div className="w-8 h-8 rounded-full border-2 border-deep-blue bg-deep-blue flex items-center justify-center text-[10px] font-bold text-white">
                   +4
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between h-full gap-6">
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 w-full max-w-xs transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-3">
                   <div className="p-2 rounded-lg bg-light-green/20 text-light-green">
                     <Clock className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-wider text-white/80">Timeline</span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-syne font-bold">14</span>
                   <span className="text-sm font-medium opacity-60">days remaining</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                   <div className="bg-light-green h-full w-[65%] rounded-full" />
                </div>
             </div>
             
             <div className="flex gap-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".csv,.json,.txt"
                />
                <button 
                  onClick={triggerUpload}
                  disabled={isUploading}
                  className="h-10 px-5 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-3 h-3" />}
                  {isUploading ? "Uploading..." : "Upload Tasks"}
                </button>
                <button 
                  onClick={handleViewBoard}
                  className="h-10 px-5 rounded-full bg-cream text-deep-blue text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <Layout className="w-3 h-3" /> View Board
                </button>
                <button 
                  onClick={handleMoreActions}
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white cursor-pointer"
                >
                   <MoreHorizontal className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content: Tasks & Roadmap */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Strategic Tasks Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <h2 className="font-syne text-2xl font-bold text-deep-blue">Strategic Tasks</h2>
                <Badge variant="outline" className="border-border-soft text-deep-blue/50 text-[10px]">
                  {tasks.filter(t => t.status !== "completed").length} OPEN
                </Badge>
              </div>
              <button 
                onClick={handleNewObjective}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-soft hover:bg-deep-blue hover:text-white hover:border-transparent transition-all duration-300 text-xs font-bold text-deep-blue uppercase tracking-widest shadow-sm hover:shadow-md cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                New Objective
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  className="group relative p-6 rounded-xl bg-white border border-transparent shadow-sm hover:shadow-elevated hover:border-soft-blue/20 transition-all duration-300 hover:-translate-y-1 cursor-default"
                >
                  <div className="flex justify-between items-start mb-4">
                    <button 
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer",
                        task.status === "completed" 
                          ? "bg-light-green text-deep-blue scale-110" 
                          : "border-2 border-border-soft text-transparent hover:border-soft-blue group-hover:scale-110"
                      )}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <Badge variant="secondary" className={cn(
                      "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5",
                      task.priority === 'high' ? "bg-red-50 text-red-600" :
                      task.priority === 'medium' ? "bg-orange-50 text-orange-600" :
                      "bg-blue-50 text-blue-600"
                    )}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <h3 className={cn(
                    "font-medium text-deep-blue leading-snug mb-4 h-12 line-clamp-2",
                    task.status === "completed" && "opacity-50 line-through decoration-deep-blue/20"
                  )}>
                    {task.title}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-dashed border-border-soft text-[11px] font-bold text-deep-blue/40 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 group-hover:text-soft-blue transition-colors">
                      <Clock className="w-3 h-3" /> {task.time}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                       <div className="w-6 h-6 rounded-full bg-surface-tinted flex items-center justify-center text-[9px] text-deep-blue">
                         {task.assignee[0]}
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Project Roadmap Section - Fills the vertical space */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 px-1">
                <h2 className="font-syne text-2xl font-bold text-deep-blue">Phase Roadmap</h2>
                <div className="h-px w-full bg-border-soft/50 flex-1 ml-4" />
            </div>
            
            <div className="rounded-[32px] bg-white border border-border-soft p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-full bg-linear-to-l from-surface-tinted/50 to-transparent pointer-events-none" />
               <div className="relative z-10 space-y-8">
                  {phases.map((phase, i) => (
                    <div key={i} className="group cursor-default">
                       <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                             <div className={cn(
                               "w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors",
                               phase.status === 'completed' ? "bg-deep-blue text-white" : 
                               phase.status === 'in-progress' ? "bg-light-green text-deep-blue" :
                               "bg-surface-sunken text-deep-blue/40"
                             )}>
                               {i + 1}
                             </div>
                             <span className={cn(
                               "font-bold text-sm uppercase tracking-wider",
                               phase.status === 'pending' ? "text-deep-blue/40" : "text-deep-blue"
                             )}>{phase.name}</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-deep-blue/50">{phase.progress}%</span>
                       </div>
                       <div className="w-full bg-surface-sunken h-2 rounded-full overflow-hidden relative">
                          <div 
                             className={cn("h-full rounded-full transition-all duration-1000 ease-out", 
                               phase.status === 'completed' ? "bg-deep-blue" : 
                               phase.status === 'in-progress' ? "bg-light-green" : "bg-transparent"
                             )} 
                             style={{ width: `${phase.progress}%` }} 
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        </div>

        {/* Right Side Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-8 space-y-8">
            {/* AI Insights Card */}
            <Card className="bg-linear-to-br from-white to-surface-tinted/30 border-white/50 backdrop-blur-sm rounded-[32px] overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500">
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-deep-blue flex items-center justify-center shadow-lg shadow-deep-blue/20">
                      <Zap className="w-5 h-5 text-light-green" />
                    </div>
                    <div>
                      <h3 className="font-syne text-lg font-bold text-deep-blue uppercase tracking-tight">AI Strategies</h3>
                      <p className="text-[9px] font-mono text-deep-blue/40 uppercase tracking-tighter">Synthesized just now</p>
                    </div>
                  </div>
                  <div className="animate-pulse w-2 h-2 rounded-full bg-light-green" />
                </div>

                <div className="space-y-3">
                  {[
                    "Consolidate design tokens into a central theme file for 20% faster implementation.",
                    "Review 'Task 4' - critical path blocker detected.",
                  ].map((suggestion, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleApplyStrategy(i)}
                      className="p-4 rounded-2xl bg-white border border-border-soft/60 hover:border-soft-blue/40 hover:bg-surface-elevated transition-all cursor-pointer group"
                    >
                      <p className="text-xs font-medium text-deep-blue/70 leading-relaxed group-hover:text-deep-blue transition-colors">
                        {suggestion}
                      </p>
                      <div className="mt-2 h-0 overflow-hidden group-hover:h-auto group-hover:mt-3 transition-all">
                        <span className="text-[10px] font-bold text-soft-blue uppercase tracking-widest flex items-center gap-1">
                          Apply <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                   <div className="rounded-2xl bg-deep-blue p-6 relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <BarChart3 className="w-16 h-16 text-white" />
                      </div>
                      <div className="space-y-2 relative z-10">
                         <div className="text-[10px] font-bold text-light-green uppercase tracking-[.2em]">Heuristic Score</div>
                         <div className="flex items-end justify-between">
                            <span className="text-4xl font-syne font-bold text-white leading-none">88</span>
                            <span className="text-[10px] font-bold text-white/40 uppercase mb-1">Optimal</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                           <div className="h-full bg-light-green w-[88%] shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </Card>

            {/* Live Activity Feed */}
            <div className="bg-surface-elevated/50 backdrop-blur-md rounded-[32px] border border-white/50 p-1">
              <div className="p-6 pb-2">
                 <h3 className="font-syne text-sm font-bold text-deep-blue uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-4 h-4 text-deep-blue/40" /> Live Activity
                 </h3>
              </div>
              <div className="h-[300px] overflow-hidden relative">
                 <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-transparent to-surface-elevated pointer-events-none" />
                 <ActivityFeed />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
