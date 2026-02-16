"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Activity, 
  Zap, 
  Clock, 
  Users, 
  ArrowUpRight, 
  Calendar,
  Layers,
  Sparkles,
  BarChart3,
  Globe,
  TrendingUp,
  Layout,
  MessageSquare,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AIInsightPanel } from "./AIInsightPanel";
import { DataVizSystem } from "./DataVizSystem";
import { PresenceSystem } from "@/components/system/PresenceSystem";
import { ActivityFeed } from "@/components/system/ActivityFeed";
import { useDemoMode } from "@/context/DemoContext";

export function DashboardOverview() {
  const router = useRouter();
  const { isDemoMode } = useDemoMode();
  
  console.log("[DashboardOverview] Rendering...");

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleProjectClick = (label: string) => {
    console.log(`[DashboardOverview] Project clicked: ${label}`);
    if (label === "Design System") {
      router.push("/dashboard/projects");
    } else {
      toast(`Navigation to ${label} details coming soon!`);
    }
  };

  const handleViewAll = () => {
    console.log("[DashboardOverview] View All Projects clicked");
    router.push("/dashboard/projects");
  };

  return (
    <div className="space-y-8 pb-20 fade-in-up">
      {/* Editorial Header Block - Matches ProjectView */}
      <div className="relative overflow-hidden rounded-[40px] bg-linear-to-br from-deep-blue to-deep-blue/90 p-10 lg:p-14 text-cream shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-soft-blue/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-light-green/20 blur-[120px] rounded-full" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-light-green/90 backdrop-blur-md text-deep-blue border-none px-3 py-1 font-mono text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-light-green/20">
                System Workspace
              </Badge>
              <div className="h-px w-8 bg-white/20" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
                Heuristic Monitor Active
              </span>
            </div>
            
            <div className="space-y-3">
              <h1 className="font-syne text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9] text-transparent bg-clip-text bg-linear-to-r from-cream via-white to-cream/80">
                Overview
              </h1>
              <p className="text-lg text-cream/70 font-medium leading-relaxed max-w-xl">
                Real-time telemetry of project velocity, system health, and heuristic productivity metrics.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <PresenceSystem />
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm transition-transform hover:scale-105 cursor-default">
                <Calendar className="w-3.5 h-3.5 text-light-green" />
                <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                  {currentDate}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between h-full gap-6">
             {/* Key Metric Card */}
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-full max-w-xs transition-transform hover:scale-[1.02] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-light-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-light-green/20 text-light-green">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/80">Velocity</span>
                  </div>
                  {isDemoMode && (
                    <Badge variant="outline" className="border-light-green/30 text-light-green text-[9px] px-1.5 py-0">
                      +4.6%
                    </Badge>
                  )}
                </div>
                <div className="relative z-10">
                   <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-syne font-bold text-white">{isDemoMode ? "98.8" : "94.2"}%</span>
                   </div>
                   <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                      <div className="bg-light-green h-full w-[94%] rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content: Projects & Data */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Projects Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-3">
                  <h2 className="font-syne text-2xl font-bold text-deep-blue">Active Projects</h2>
                  <div className="h-px w-24 bg-border-soft/50" />
               </div>
               <button 
                onClick={handleViewAll}
                className="text-xs font-bold text-deep-blue uppercase tracking-widest hover:text-soft-blue transition-colors flex items-center gap-1 cursor-pointer"
               >
                  View All <ArrowUpRight className="w-3 h-3" />
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {[
                  { label: "Design System", progress: 85, status: "Active", icon: Layers, color: "text-purple-600", bg: "bg-purple-100", barColor: "bg-purple-500" },
                  { label: "API Integration", progress: 62, status: "In Progress", icon: Globe, color: "text-blue-600", bg: "bg-blue-100", barColor: "bg-blue-500" },
                  { label: "User Feedback Loop", progress: 40, status: "Review", icon: Users, color: "text-orange-600", bg: "bg-orange-100", barColor: "bg-orange-500" },
                  { label: "Analytics Dashboard", progress: 92, status: "Polishing", icon: BarChart3, color: "text-pink-600", bg: "bg-pink-100", barColor: "bg-pink-500" },
               ].map((project, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleProjectClick(project.label)}
                    className="group relative p-6 rounded-xl bg-white border border-transparent shadow-sm hover:shadow-elevated hover:border-soft-blue/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                     <div className="flex justify-between items-start mb-6">
                        <div className={cn("p-3 rounded-xl transition-all duration-300 group-hover:scale-110", project.bg)}>
                           <project.icon className={cn("w-5 h-5", project.color)} />
                        </div>
                        <Badge variant="secondary" className="bg-surface-tinted text-deep-blue/60 text-[9px] font-bold uppercase tracking-wider">
                           {project.status}
                        </Badge>
                     </div>
                     
                     <h3 className="font-syne text-lg font-bold text-deep-blue mb-1">{project.label}</h3>
                     <div className="flex items-center justify-between text-[11px] text-deep-blue/40 font-medium mb-4">
                        <span>Milestone 3/5</span>
                        <span>{project.progress}%</span>
                     </div>
                     
                     <div className="relative h-1.5 w-full bg-surface-sunken rounded-full overflow-hidden">
                        <div 
                           className={cn("absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out", project.barColor)}
                           style={{ width: `${project.progress}%` }}
                        />
                     </div>
                  </div>
               ))}
            </div>
          </section>

          {/* System Health & Activity Feed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* System Health Card */}
              <Card className="rounded-[32px] border-none bg-surface-elevated shadow-soft overflow-hidden h-full">
                 <div className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-syne text-lg font-bold text-deep-blue uppercase tracking-tight flex items-center gap-2">
                          <Activity className="w-5 h-5 text-soft-blue" /> System Health
                       </h3>
                       <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-light-green animate-pulse" />
                          <div className="w-1.5 h-1.5 rounded-full bg-light-green/30" />
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                       <div className="p-4 rounded-2xl bg-white border border-border-soft flex justify-between items-center group hover:border-soft-blue/30 transition-all">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-light-green" />
                             <span className="text-xs font-bold text-deep-blue/60 uppercase tracking-wide">Uptime</span>
                          </div>
                          <span className="font-mono font-bold text-deep-blue">99.98%</span>
                       </div>
                       
                       <div className="p-4 rounded-2xl bg-white border border-border-soft flex justify-between items-center group hover:border-soft-blue/30 transition-all">
                          <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-soft-blue" />
                             <span className="text-xs font-bold text-deep-blue/60 uppercase tracking-wide">Latency</span>
                          </div>
                          <span className="font-mono font-bold text-deep-blue">24ms</span>
                       </div>
                    </div>
                 </div>
                 
                 {/* Mini Utilization Graph Visualization */}
                 <div className="relative h-24 mt-4 bg-surface-sunken/50 w-full overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 pb-0 h-16 gap-1">
                       {[40, 60, 45, 70, 50, 65, 55, 80, 75, 60, 90, 85].map((h, i) => (
                          <div 
                             key={i} 
                             className="w-full bg-soft-blue/20 rounded-t-sm hover:bg-soft-blue/40 transition-colors"
                             style={{ height: `${h}%` }}
                          />
                       ))}
                    </div>
                 </div>
              </Card>

              {/* Activity Feed */}
              <div className="bg-surface-elevated/50 backdrop-blur-md rounded-[32px] border border-white/50 p-1 h-full">
                <div className="p-6 pb-2">
                   <h3 className="font-syne text-sm font-bold text-deep-blue uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-deep-blue/40" /> Recent Activity
                   </h3>
                </div>
                <div className="h-[280px] overflow-hidden relative">
                   <div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-transparent to-surface-elevated pointer-events-none" />
                   <ActivityFeed />
                </div>
              </div>
          </div>

          {/* Data Visualization Section */}
          <section className="space-y-6">
             <div className="bg-white rounded-[32px] p-8 border border-border-soft shadow-soft">
                <div className="flex flex-col gap-1 mb-8">
                   <h2 className="font-syne text-xl font-bold text-deep-blue">Strategic Operations</h2>
                   <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-deep-blue/40">System-wide performance telemetry</p>
                </div>
                <DataVizSystem />
             </div>
          </section>
        </div>

        {/* Sidebar: AI & Health */}
        <div className="lg:col-span-4 space-y-8">
           <div className="sticky top-8 space-y-8">
              
              {/* AI Insight Panel */}
              <div className="transform transition-all duration-500 hover:translate-x-[-4px]">
                 <AIInsightPanel />
              </div>


           </div>
        </div>
      </div>
    </div>
  );
}
