"use client";

import React, { useState } from "react";
import SecurityPanel from "@/components/system/SecurityPanel";
import BrandingPanel from "@/components/system/BrandingPanel";
import { BillingPanel } from "@/components/system/BillingPanel";
import { 
  Shield, 
  Palette, 
  CreditCard,
  Settings,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useWorkspaces } from "@/context/WorkspaceContext";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("ai");
  const { activeWorkspace: activeWs } = useWorkspaces();

  const tabs = [
    { id: "ai", label: "AI", icon: Sparkles },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "ai":
        return <div className="p-6 sm:p-10 lg:p-14 flex flex-col items-center justify-center text-center space-y-4">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-sage" />
            <h2 className="text-xl sm:text-2xl font-bold text-sage-deep uppercase tracking-widest">AI Intelligence</h2>
            <p className="text-text-muted text-sm max-w-sm">Manage your workspace's neural capabilities and autonomous agents.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8">
                <div className="p-6 rounded-2xl bg-bg-alt border border-border-soft text-left group hover:border-sage-soft transition-all shadow-soft">
                    <h3 className="font-bold text-sage-deep">Smart Suggestions</h3>
                    <p className="text-[11px] text-text-secondary mt-1">AI will automatically suggest subtasks and priorities based on task context.</p>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="w-10 h-5 bg-sage-mid rounded-full relative shadow-inner">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                        <span className="text-[9px] font-bold text-sage-deep uppercase tracking-widest">Active</span>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-bg-alt border border-border-soft text-left opacity-50 shadow-soft">
                    <h3 className="font-bold text-sage-deep">Predictive Analytics</h3>
                    <p className="text-[11px] text-text-secondary mt-1">Predict project delays before they happen using historical velocity.</p>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="w-10 h-5 bg-text-muted/20 rounded-full relative">
                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Offline</span>
                    </div>
                </div>
            </div>
        </div>;
      case "billing":
        if (!activeWs) return <div className="p-10 text-center animate-pulse text-sage-deep/40 italic">Synchronizing assets...</div>;
        return <BillingPanel workspace={activeWs} />;
      default:
        return activeWs ? <BillingPanel workspace={activeWs} /> : null;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 fade-in-up">
      {/* Editorial Header Block */}
      <div className="relative overflow-hidden rounded-3xl lg:rounded-[40px] bg-linear-to-br from-sage-deep to-[#1E2822] p-8 sm:p-10 lg:p-14 text-white shadow-elevated">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(124,154,139,0.2),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-sage-mid/10 blur-[120px] rounded-full" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Badge className="bg-sage text-sage-deep border-none px-3 py-1 text-[9px] uppercase tracking-widest font-bold">
              Config
            </Badge>
            <div className="h-px w-6 sm:w-8 bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.3em] opacity-60">
              Workspace & System
            </span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-none">
              Settings
            </h1>
            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-xl">
              Configure your workspace, manage AI permissions, and monitor your neural workflow performance.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-border-soft shadow-soft w-full sm:w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 group cursor-pointer",
                activeTab === tab.id 
                  ? "bg-sage-deep text-white shadow-lg" 
                  : "text-text-muted hover:bg-bg-alt hover:text-sage-deep"
              )}
            >
              <tab.icon className={cn(
                "w-3.5 h-3.5",
                 activeTab === tab.id ? "text-sage" : "text-text-muted group-hover:text-sage-deep"
              )} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4 bg-white/50 px-5 py-3 rounded-2xl border border-border-soft/20">
           <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">
              FlowBoard v2.4.0
           </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl lg:rounded-[40px] border border-border-soft shadow-soft overflow-hidden min-h-[400px] sm:min-h-[600px]">
        {renderPanel()}
      </div>
    </div>
  );
}
