"use client";

import React, { useState } from "react";
import { AutomationPanel } from "@/components/system/AutomationPanel";
import SecurityPanel from "@/components/system/SecurityPanel";
import BrandingPanel from "@/components/system/BrandingPanel";
import { BillingPanel } from "@/components/system/BillingPanel";
import { 
  Zap, 
  Shield, 
  Palette, 
  CreditCard,
  Settings 
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useWorkspaces } from "@/context/WorkspaceContext";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("automations");
  const { activeWorkspace: activeWs } = useWorkspaces();

  const tabs = [
    { id: "automations", label: "Automations", icon: Zap },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const handleTabChange = (id: string) => {
    console.log(`[SettingsPage] Tab changed to: ${id}`);
    setActiveTab(id);
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "automations":
        return <AutomationPanel />;
      case "billing":
        return <BillingPanel workspace={activeWs} />;
      default:
        return <AutomationPanel />;
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
                          ? "bg-sage-deep text-cream shadow-md" 
                          : "text-sage-deep/60 hover:bg-soft-blue/10 hover:text-sage-deep"
                      )}
                    >
                      <tab.icon className={cn(
                        "w-4 h-4 transition-colors",
                         activeTab === tab.id ? "text-light-green" : "text-sage-deep/40 group-hover:text-sage-deep"
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
                 <p className="text-[10px] font-mono text-sage-deep/30 uppercase tracking-widest text-center">
                    FlowBoard Systems v2.4.0
                 </p>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[32px] border border-soft-blue/10 shadow-soft overflow-hidden min-h-[600px]">
            {renderPanel()}
          </div>
        </div>
      </div>
    </div>
  );
}
