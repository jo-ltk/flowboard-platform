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

  console.log("[DashboardOverview] Rendering...");

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleProjectClick = (project: any) => {
    console.log(`[DashboardOverview] Project clicked: ${project.label}`);
    const params = new URLSearchParams();
    params.set('id', project.id);
    params.set('name', project.label);
    if (project.description) params.set('description', project.description);
    
    router.push(`/dashboard/projects?${params.toString()}`);
  };

  const handleViewAll = () => {
    console.log("[DashboardOverview] View All Projects clicked");
    router.push("/dashboard/projects");
  };

  return (
    <div className="space-y-6 pb-20 fade-in-up">
      {/* ─── Calm Editorial Header ─── */}
      <div className="relative overflow-hidden  bg-white border border-[#DDE5E1] p-8 lg:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
        {/* Subtle sage orb */}
        <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-[#AFC8B8]/12 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#7C9A8B]/10 border border-[#7C9A8B]/20 text-[#5F7D6E] text-[11px] font-semibold uppercase tracking-[0.08em]">
                {activeWorkspace?.name || "Initializing..."}
              </span>
              <div className="h-3.5 w-px bg-[#DDE5E1]" />
              <span className="text-[11px] text-[#8A9E96] font-medium uppercase tracking-[0.12em]">
                Flow Monitor
              </span>
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-[#2F3A35]">
                Good morning ☀️
              </h1>
              <p className="mt-2 text-base text-[#5C6B64] font-light leading-relaxed max-w-md">
                Here's your project overview — calm, clear, and up to date.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <PresenceSystem />
              <div className="h-3.5 w-px bg-[#DDE5E1]" />
              <div className="flex items-center gap-2 bg-[#F4F7F5] px-3.5 py-2 rounded-full border border-[#DDE5E1] cursor-default">
                <Calendar className="w-3.5 h-3.5 text-[#7C9A8B]" />
                <span className="text-[11px] font-medium text-[#5C6B64] tracking-wide">
                  {currentDate}
                </span>
              </div>
            </div>
          </div>

          {/* Velocity metric */}
          <div className="lg:col-span-4">
            <div className="bg-[#F4F7F5]  p-6 border border-[#DDE5E1] hover:border-[#AFC8B8] transition-all duration-200 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#7C9A8B]/12 border border-[#7C9A8B]/20">
                    <Zap className="w-3.5 h-3.5 text-[#7C9A8B]" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8A9E96]">Team Velocity</span>
                </div>
                {(isDemoMode || (data?.stats?.velocity > 90)) && (
                  <Badge variant="outline" className="border-[#AFC8B8] text-[#5F7D6E] text-[9px] px-2 py-0.5">
                    +{data?.stats?.velocity > 90 ? "4.6%" : "2.1%"}
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#2F3A35]">
                  {loading ? "–" : (data?.stats?.velocity || "94.2")}
                </span>
                <span className="text-lg font-semibold text-[#8A9E96]">%</span>
              </div>
              <div className="w-full bg-[#DDE5E1] h-1.5 rounded-full mt-3.5 overflow-hidden">
                <div
                  className="bg-[#7C9A8B] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${data?.stats?.velocity || 94}%` }}
                />
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
                  <h2 className="text-2xl font-bold text-[#2F3A35]">Active Projects</h2>
                  <div className="h-[2px] w-16 bg-[#DDE5E1]" />
               </div>
               <button 
                onClick={handleViewAll}
                className="text-xs font-bold text-[#7C9A8B] uppercase tracking-widest hover:text-[#5F7D6E] transition-colors flex items-center gap-1.5 cursor-pointer"
               >
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
               </button>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {loading ? (
                 [1, 2, 3, 4].map((i) => (
                   <div key={i} className="h-44  bg-[#E9EFEC] animate-pulse border border-[#DDE5E1]" />
                 ))
               ) : (
                 (data?.projects || []).map((project: any, i: number) => {
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
                          className="group relative p-6  bg-white border border-[#DDE5E1] shadow-[0_1px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] hover:border-[#AFC8B8] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-5">
                            <div className="p-2.5 rounded-xl bg-[#F4F7F5] border border-[#DDE5E1] transition-all duration-200 group-hover:border-[#AFC8B8]">
                              <ProjectIcon className="w-4.5 h-4.5 text-[#7C9A8B]" />
                            </div>
                            <Badge variant="secondary" className="bg-[#F4F7F5] text-[#8A9E96] border border-[#DDE5E1] text-[9px] font-semibold uppercase tracking-wider">
                              {project.status}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-base text-[#2F3A35] mb-2">{project.label}</h3>
                          <div className="flex items-center justify-between text-[11px] text-[#8A9E96] font-medium mb-3">
                            <span>Progress</span>
                            <span className="font-semibold text-[#5C6B64]">{project.progress}%</span>
                          </div>

                          <div className="relative h-1.5 w-full bg-[#E9EFEC] rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full rounded-full bg-[#7C9A8B] transition-all duration-1000 ease-out"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* System Health Card */}
              <Card className=" border border-[#DDE5E1] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden h-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-semibold text-[#2F3A35] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#7C9A8B]" /> System Health
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#7C9A8B] animate-pulse" />
                      <span className="text-[10px] text-[#8A9E96] font-medium">Live</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#F4F7F5] border border-[#DDE5E1] hover:border-[#AFC8B8] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-[#7C9A8B]" />
                        <span className="text-xs font-medium text-[#5C6B64] uppercase tracking-wide">Uptime</span>
                      </div>
                      <span className="text-sm font-semibold text-[#2F3A35]">{data?.stats?.uptime || "99.98%"}</span>
                    </div>

                    <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#F4F7F5] border border-[#DDE5E1] hover:border-[#AFC8B8] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-[#AFC8B8]" />
                        <span className="text-xs font-medium text-[#5C6B64] uppercase tracking-wide">Latency</span>
                      </div>
                      <span className="text-sm font-semibold text-[#2F3A35]">{data?.stats?.latency || "24ms"}</span>
                    </div>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="h-20 bg-[#F4F7F5] border-t border-[#DDE5E1] flex items-end gap-0.5 p-3">
                  {[40, 60, 45, 70, 50, 65, 55, 80, 75, 60, 90, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-colors"
                      style={{
                        height: `${h}%`,
                        background: i >= 9 ? "#7C9A8B" : `rgba(175,200,184,${0.25 + i * 0.06})`
                      }}
                    />
                  ))}
                </div>
              </Card>

              {/* Activity Feed */}
              <div className="bg-white  border border-[#DDE5E1] shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-full overflow-hidden">
                <div className="p-5 border-b border-[#DDE5E1]">
                  <h3 className="text-sm font-semibold text-[#2F3A35] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#7C9A8B]" /> Recent Activity
                  </h3>
                </div>
                <div className="h-[280px] overflow-hidden relative">
                  <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />
                  <ActivityFeed />
                </div>
              </div>
          </div>

          {/* Data Visualization Section */}
          <section>
            <div className="bg-white  border border-[#DDE5E1] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-7">
              <div className="flex flex-col gap-1 mb-6">
                <h2 className="text-lg font-semibold text-[#2F3A35]">Project Analytics</h2>
                <p className="text-[11px] text-[#8A9E96] font-medium uppercase tracking-[0.12em]">Performance overview</p>
              </div>
              <DataVizSystem stats={data?.stats} />
            </div>
          </section>
        </div>

        {/* Sidebar: AI & Health */}
        <div className="lg:col-span-4 space-y-8">
           <div className="sticky top-8 space-y-8">
              
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
