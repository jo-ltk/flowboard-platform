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
    { id: "ai", label: "AI Intelligence", icon: Sparkles },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "ai":
        return <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <Sparkles className="w-12 h-12 text-light-green" />
            <h2 className="text-2xl font-syne font-bold text-sage-deep">AI Intelligence Center</h2>
            <p className="text-soft-blue max-w-sm">Manage your workspace's neural capabilities and autonomous agents.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8">
                <div className="p-6 rounded-2xl bg-soft-blue/5 border border-soft-blue/10 text-left">
                    <h3 className="font-bold text-sage-deep">Smart Suggestions</h3>
                    <p className="text-xs text-soft-blue mt-1">AI will automatically suggest subtasks and priorities based on task context.</p>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="w-10 h-5 bg-light-green rounded-full relative">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                        <span className="text-[10px] font-bold text-sage-deep uppercase tracking-widest">Active</span>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-soft-blue/5 border border-soft-blue/10 text-left opacity-50">
                    <h3 className="font-bold text-sage-deep">Predictive Analytics</h3>
                    <p className="text-xs text-soft-blue mt-1">Predict project delays before they happen using historical velocity.</p>
                    <div className="mt-4 flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-5 bg-soft-blue/20 rounded-full relative">
                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                        <span className="text-[10px] font-bold text-soft-blue uppercase tracking-widest">Disabled</span>
                    </div>
                </div>
            </div>
        </div>;
      case "billing":
        return <BillingPanel workspace={activeWs} />;
      default:
        return <BillingPanel workspace={activeWs} />;
    }
  };

  return (
    <div className="space-y-8 pb-20 fade-in-up">
      {/* Editorial Header Block */}
      <div className="relative overflow-hidden rounded-[40px] bg-linear-to-br from-sage-deep to-sage-deep/90 p-10 lg:p-14 text-cream shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-soft-blue/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-light-green/20 blur-[120px] rounded-full" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-light-green/90 backdrop-blur-md text-sage-deep border-none px-3 py-1 font-mono text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-light-green/20">
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
                Configure your workspace, manage AI permissions, and monitor your neural workflow performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-[20px] border border-soft-blue/10 shadow-soft w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-[14px] text-sm font-bold transition-all duration-500 group relative cursor-pointer",
                activeTab === tab.id 
                  ? "bg-sage-deep text-cream shadow-2xl scale-[1.02]" 
                  : "text-sage-deep/60 hover:bg-soft-blue/5 hover:text-sage-deep"
              )}
            >
              <tab.icon className={cn(
                "w-4 h-4 transition-colors duration-500",
                 activeTab === tab.id ? "text-light-green" : "text-sage-deep/30 group-hover:text-sage-deep"
              )} />
              <span className="tracking-wide">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-light-green shadow-[0_0_12px_rgba(204,255,0,0.8)]" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm px-5 py-3 rounded-2xl border border-soft-blue/5">
           <p className="text-[10px] font-mono text-sage-deep/40 uppercase tracking-[0.2em]">
              FlowBoard Systems v2.4.0
           </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[40px] border border-soft-blue/10 shadow-2xl shadow-sage-deep/5 overflow-hidden min-h-[600px] transition-all duration-500">
        <div className="w-full">
          {renderPanel()}
        </div>
      </div>
    </div>
  );
}
