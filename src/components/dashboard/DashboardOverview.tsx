"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Activity, 
  Zap, 
  Users, 
  ArrowUpRight, 
  Calendar,
  Layers,
  BarChart3,
  Globe,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AIInsightPanel } from "./AIInsightPanel";
import { DataVizSystem } from "./DataVizSystem";
import { PresenceSystem } from "@/components/system/PresenceSystem";
import { ActivityFeed } from "@/components/system/ActivityFeed";
import { useDemoMode } from "@/context/DemoContext";
import { useWorkspaces } from "@/context/WorkspaceContext";

export function DashboardOverview() {
  const router = useRouter();
  const { isDemoMode } = useDemoMode();
  const { activeWorkspace } = useWorkspaces();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/dashboard/overview?workspaceId=${activeWorkspace?.id}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!activeWorkspace?.id) return;
    fetchData();
  }, [activeWorkspace?.id]);

  React.useEffect(() => {
    const handleRefresh = () => {
      console.log("[DashboardOverview] Refreshing due to external event...");
      if (activeWorkspace?.id) fetchData();
    };
    window.addEventListener("refresh-tasks", handleRefresh);
    return () => window.removeEventListener("refresh-tasks", handleRefresh);
  }, [activeWorkspace?.id]);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleProjectClick = (project: any) => {
    const params = new URLSearchParams();
    params.set('id', project.id);
    params.set('name', project.label);
    if (project.description) params.set('description', project.description);
    
    router.push(`/dashboard/projects?${params.toString()}`);
  };

  const handleViewAll = () => {
    router.push("/dashboard/projects");
  };

  return (
    <div className="space-y-6 lg:space-y- gap-section pb-20 fade-in-up px-0 sm:px-0">
      {/* ─── Calm Editorial Header ─── */}
      <div className="card-wellness relative overflow-hidden bg-white p-6 lg:p-10">
        {/* Subtle sage orb */}
        <div className="absolute top-0 right-0 w-[200px] lg:w-[300px] h-[150px] lg:h-[200px] bg-[#7C9A8B]/10 blur-[60px] lg:blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          <div className="lg:col-span-8 space-y-4 lg:space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge-sage">
                {activeWorkspace?.name || "Initializing..."}
              </span>
              <div className="h-3.5 w-px bg-[#DDE5E1]" />
              <span className="text-[10px] text-[#8A9E96] font-bold uppercase tracking-[0.2em]">
                Flow Monitor
              </span>
            </div>

            <div>
              <h1 className="text-dashboard-heading font-bold tracking-tight leading-tight text-[#2F3A35] lg:text-5xl">
                Good morning ☀️
              </h1>
              <p className="mt-2 text-dashboard-body text-[#5C6B64] font-light leading-relaxed max-w-md">
                Here's your project overview — calm, clear, and up to date.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <PresenceSystem />
              <div className="hidden sm:block h-3.5 w-px bg-[#DDE5E1]" />
              <div className="flex items-center gap-2 bg-[#F4F7F5] px-3.5 py-2 rounded-full border border-[#DDE5E1] cursor-default">
                <Calendar className="w-3.5 h-3.5 text-[#7C9A8B]" />
                <span className="text-[10px] font-bold text-[#5C6B64] uppercase tracking-wider">
                  {currentDate}
                </span>
              </div>
            </div>
          </div>

          {/* Velocity metric */}
          <div className="lg:col-span-4 self-stretch sm:self-auto">
            <div className="bg-[#F4F7F5] p-6 lg:p-8 border border-[#DDE5E1] hover:border-[#AFC8B8] transition-all duration-300 group rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white border border-[#DDE5E1]">
                    <Zap className="w-3.5 h-3.5 text-[#7C9A8B]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A9E96]">Team Velocity</span>
                </div>
                {(isDemoMode || (data?.stats?.velocity > 90)) && (
                  <Badge variant="outline" className="border-[#AFC8B8] bg-white text-sage-mid text-[9px] px-2 py-0.5 rounded-full">
                    +{data?.stats?.velocity > 90 ? "4.6%" : "2.1%"}
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl lg:text-5xl font-bold text-[#2F3A35]">
                  {loading ? "–" : (data?.stats?.velocity || "94.2")}
                </span>
                <span className="text-lg font-bold text-[#8A9E96] uppercase tracking-widest">%</span>
              </div>
              <div className="w-full bg-[#DDE5E1] h-1.5 rounded-full mt-5 overflow-hidden">
                <div
                  className="bg-[#7C9A8B] h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${data?.stats?.velocity || 94}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-section">
        {/* Main Content: Projects & Data */}
        <div className="lg:col-span-8 space-y-gap-section">
          
          {/* Active Projects Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-3">
                  <h2 className="text-xl lg:text-2xl font-bold text-[#2F3A35]">Active Projects</h2>
                  <div className="hidden sm:block h-[2px] w-12 bg-[#DDE5E1]" />
               </div>
               <button 
                onClick={handleViewAll}
                className="text-[10px] font-black text-[#7C9A8B] uppercase tracking-[0.2em] hover:text-sage-mid transition-colors flex items-center gap-1.5 cursor-pointer"
               >
                  All Projects <ArrowUpRight className="w-3.5 h-3.5" />
               </button>
            </div>
            
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
               {loading ? (
                 [1, 2, 3, 4].map((i) => (
                   <div key={i} className="h-44 bg-[#E9EFEC] animate-pulse border border-[#DDE5E1] rounded-2xl" />
                 ))
               ) : (
                 (data?.projects || []).slice(0, 4).map((project: any, i: number) => {
                    const ProjectIcon = (() => {
                        switch(project.icon) {
                            case 'Layers': return Layers;
                            case 'Globe': return Globe;
                            case 'Users': return Users;
                            case 'BarChart3': return BarChart3;
                            default: return Layers;
                        }
                    })();

                    return (
                        <div
                          key={i}
                          onClick={() => handleProjectClick(project)}
                          className="card-wellness group p-6 cursor-pointer hover:border-[#7C9A8B]"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="p-2.5 rounded-xl bg-[#F4F7F5] border border-[#DDE5E1] transition-all duration-300 group-hover:border-[#AFC8B8] group-hover:bg-white">
                              <ProjectIcon className="w-4.5 h-4.5 text-[#7C9A8B]" />
                            </div>
                            <Badge variant="secondary" className="bg-[#F4F7F5] text-[#8A9E96] border border-[#DDE5E1] text-[9px] font-bold uppercase tracking-widest rounded-full group-hover:bg-white group-hover:text-[#7C9A8B] transition-colors">
                              {project.status}
                            </Badge>
                          </div>

                          <h3 className="font-bold text-base text-[#2F3A35] mb-2">{project.label}</h3>
                          <div className="flex items-center justify-between text-[10px] text-[#8A9E96] font-bold uppercase tracking-wider mb-4">
                            <span>Efficiency</span>
                            <span className="text-[#5C6B64]">{project.progress}%</span>
                          </div>

                          <div className="relative h-1.5 w-full bg-[#E9EFEC] rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full rounded-full bg-[#7C9A8B] transition-all duration-1000 ease-in-out"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                    );
                 })
               )}
            </div>
          </section>

          {/* System Health & Activity Feed Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-section">
              {/* System Health Card */}
              <Card className="card-wellness border-[#DDE5E1] bg-white overflow-hidden h-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[11px] font-bold text-[#2F3A35] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#7C9A8B]" /> System Health
                    </h3>
                    <div className="flex items-center gap-1.5 bg-[#F4F7F5] px-2 py-1 rounded-full border border-[#DDE5E1]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7C9A8B] animate-pulse" />
                      <span className="text-[9px] text-sage-mid font-bold uppercase tracking-widest">Live</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-[#F4F7F5] border border-[#DDE5E1] hover:border-[#AFC8B8] hover:bg-white transition-all duration-300 cursor-default">
                      <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7C9A8B]" />
                        <span className="text-[10px] font-bold text-[#5C6B64] uppercase tracking-widest">Uptime</span>
                      </div>
                      <span className="text-xs font-bold text-[#2F3A35] tracking-tight">{data?.stats?.uptime || "99.98%"}</span>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-xl bg-[#F4F7F5] border border-[#DDE5E1] hover:border-[#AFC8B8] hover:bg-white transition-all duration-300 cursor-default">
                      <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#AFC8B8]" />
                        <span className="text-[10px] font-bold text-[#5C6B64] uppercase tracking-widest">Latency</span>
                      </div>
                      <span className="text-xs font-bold text-[#2F3A35] tracking-tight">{data?.stats?.latency || "24ms"}</span>
                    </div>
                  </div>

                </div>

                {/* Mini bar chart */}
                <div className="h-20 bg-[#F4F7F5] border-t border-[#DDE5E1] flex items-end gap-1 p-4">
                  {[40, 60, 45, 70, 50, 65, 55, 80, 75, 60, 90, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-[2px] transition-all duration-500 hover:bg-[#7C9A8B] group relative"
                      style={{
                        height: `${h}%`,
                        background: i >= 9 ? "#7C9A8B" : `rgba(124, 154, 139, ${0.15 + i * 0.05})`
                      }}
                    >
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#2F3A35] text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">
                         {h}%
                       </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Activity Feed */}
              <div className="card-wellness bg-white h-[400px] sm:h-auto overflow-hidden flex flex-col">
                <div className="p-6 border-b border-[#DDE5E1] bg-white">
                  <h3 className="text-[11px] font-bold text-[#2F3A35] uppercase tracking-[0.2em] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#7C9A8B]" /> Recent Activity
                  </h3>
                </div>
                <div className="flex-1 overflow-hidden relative p-6 pt-0">
                  <div className="absolute inset-x-0 bottom-0 h-16 z-10 bg-linear-to-t from-white to-transparent pointer-events-none" />
                  <ActivityFeed minimal={true} />
                </div>
              </div>
          </div>

          {/* Data Visualization Section */}
          <section>
            <div className="card-wellness bg-white p-6 lg:p-8">
              <div className="flex flex-col gap-1 mb-8">
                <h2 className="text-lg lg:text-xl font-bold text-[#2F3A35]">Project Analytics</h2>
                <span className="text-[10px] text-[#8A9E96] font-bold uppercase tracking-[0.2em]">Heuristic Performance Monitor</span>
              </div>
              <DataVizSystem stats={data?.stats} />
            </div>
          </section>
        </div>

        {/* Sidebar: AI & Health */}
        <div className="lg:col-span-4 space-y-gap-section">
           <div className="lg:sticky lg:top-8 space-y-gap-section">
              
              {/* AI Insight Panel */}
              <div className="transform transition-all duration-500 hover:translate-x-[-4px]">
                  <AIInsightPanel stats={data?.stats} />
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}

