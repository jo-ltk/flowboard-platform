"use client";

import React, { useState } from "react";
import { AutomationPanel } from "@/components/system/AutomationPanel";
import { Settings, Shield, Bell, Zap, Database, Sliders, Lock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("automations");

  const tabs = [
    { id: "automations", label: "Automations", icon: Zap },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "integrations", label: "Integrations", icon: Sliders },
    { id: "data", label: "Data Export", icon: Database },
    { id: "admin", label: "Admin Permissions", icon: Lock },
  ];

  const handleTabChange = (id: string) => {
    console.log(`[SettingsPage] Tab changed to: ${id}`);
    setActiveTab(id);
    if (id !== "automations") {
      toast.info(`${id.charAt(0).toUpperCase() + id.slice(1)} settings coming soon!`);
    }
  };

  return (
    <div className="space-y-8 pb-20 fade-in-up">
      {/* Editorial Header Block */}
      <div className="relative overflow-hidden rounded-[40px] bg-linear-to-br from-deep-blue to-deep-blue/90 p-10 lg:p-14 text-cream shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-soft-blue/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-light-green/20 blur-[120px] rounded-full" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-light-green/90 backdrop-blur-md text-deep-blue border-none px-3 py-1 font-mono text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-light-green/20">
                Configuration
              </Badge>
              <div className="h-px w-8 bg-white/20" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
                Workspace & System
              </span>
            </div>
            
            <div className="space-y-3">
              <h1 className="font-syne text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9] text-transparent bg-clip-text bg-linear-to-r from-cream via-white to-cream/80">
                Settings
              </h1>
              <p className="text-lg text-cream/70 font-medium leading-relaxed max-w-xl">
                Configure your workspace, manage AI permissions, and architect your ideal workflow automation system.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-8">
          <div className="sticky top-8">
             <Card className="rounded-[24px] bg-white border border-soft-blue/10 shadow-soft overflow-hidden p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 group relative overflow-hidden cursor-pointer",
                        activeTab === tab.id 
                          ? "bg-deep-blue text-cream shadow-md" 
                          : "text-deep-blue/60 hover:bg-soft-blue/10 hover:text-deep-blue"
                      )}
                    >
                      <tab.icon className={cn(
                        "w-4 h-4 transition-colors",
                         activeTab === tab.id ? "text-light-green" : "text-deep-blue/40 group-hover:text-deep-blue"
                      )} />
                      <span className="tracking-wide">{tab.label}</span>
                      {activeTab === tab.id && (
                         <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-light-green shadow-[0_0_8px_rgba(204,255,0,0.6)]" />
                      )}
                    </button>
                  ))}
                </nav>
             </Card>
             
             {/* Admin / Footer Links could go here */}
             <div className="mt-6 px-4">
                 <p className="text-[10px] font-mono text-deep-blue/30 uppercase tracking-widest text-center">
                    FlowBoard Systems v2.4.0
                 </p>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[32px] border border-soft-blue/10 shadow-soft overflow-hidden min-h-[600px]">
            {activeTab === "automations" ? (
              <AutomationPanel />
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] text-center p-10 space-y-4">
                <div className="p-4 rounded-full bg-soft-blue/10 text-soft-blue">
                   <Settings className="w-8 h-8 animate-spin-slow" />
                </div>
                <h2 className="font-syne text-2xl font-bold text-deep-blue">Under Construction</h2>
                <p className="text-deep-blue/60 max-w-md">
                  We're currently architecting the {activeTab} experience. Check back soon for full control.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
