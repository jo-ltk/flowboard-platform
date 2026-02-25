"use client";

import { useState } from "react";
import WebhookManager from "@/components/system/WebhookManager";
import { Terminal, Copy, Key, Shield, ArrowRight, BarChart3, Code } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TAB_LABELS: Record<string, string> = {
  "api-keys": "API Keys",
  webhooks: "Webhooks",
  usage: "Usage",
  docs: "Docs",
};

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState("api-keys");
  const [apiKey] = useState("sk_live_51M0...");
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API Key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 fade-in-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border border-border-soft p-6 sm:p-8 lg:p-10 shadow-soft rounded-2xl lg:rounded-3xl">
        <div className="absolute top-0 right-0 w-[200px] sm:w-[300px] h-[150px] sm:h-[200px] bg-sage-soft/10 blur-[60px] sm:blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-sage-deep/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-sage/10 border border-sage/20 text-sage-mid text-[10px] font-bold uppercase tracking-widest">
              Developer
            </span>
            <div className="h-3.5 w-px bg-border-soft" />
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-widest">Portal</span>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-sage-deep leading-tight">
              Developer <span className="text-text-muted font-light">Platform</span>
            </h1>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-text-secondary font-light leading-relaxed max-w-2xl">
              Build powerful integrations. Access your data programmatically, listen for real-time events, and extend workspace capabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 overflow-x-auto bg-white border border-border-soft rounded-2xl shadow-soft p-1.5 scrollbar-hide">
        {Object.keys(TAB_LABELS).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 min-w-max py-2.5 px-4 sm:px-6 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer whitespace-nowrap",
              activeTab === tab
                ? "bg-sage-deep text-white shadow-soft"
                : "text-text-muted hover:text-sage-deep hover:bg-bg-alt"
            )}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* Main Panel */}
        <div className="lg:col-span-2 space-y-6">

          {activeTab === "api-keys" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border-soft shadow-soft">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-sage-deep mb-1 flex items-center gap-2">
                      <Key className="w-4 h-4 text-sage" />
                      Production Keys
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary">
                      These keys have full access to your workspace. Keep them secret.
                    </p>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest bg-sage-deep text-white px-4 py-2.5 rounded-xl hover:bg-black transition-colors cursor-pointer shrink-0">
                    Roll Key
                  </button>
                </div>

                <div className="bg-bg-alt p-4 rounded-xl flex items-center justify-between font-mono text-xs sm:text-sm border border-border-soft group">
                  <span className="text-text-secondary truncate max-w-[200px] sm:max-w-[300px] blur-[2px] group-hover:blur-none transition-all">
                    {apiKey}
                  </span>
                  <button
                    onClick={copyKey}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-text-muted hover:text-sage-deep ml-3 shrink-0 cursor-pointer"
                  >
                    {copied ? <span className="text-[10px] font-sans text-emerald-600 font-bold">Copied!</span> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-sage-deep uppercase tracking-widest">Quick Start</h3>
                <div className="bg-sage-deep rounded-2xl p-5 sm:p-6 text-white font-mono text-xs overflow-x-auto shadow-elevated">
                  <div className="flex gap-3 mb-4 border-b border-white/10 pb-4">
                    <span className="text-sage-soft font-bold text-[10px] uppercase tracking-widest">cURL</span>
                    <span className="text-white/30 text-[10px]">Node.js</span>
                    <span className="text-white/30 text-[10px]">Python</span>
                  </div>
                  <ClientCodeBlock />
                </div>
              </div>
            </div>
          )}

          {activeTab === "webhooks" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <WebhookManager />
            </div>
          )}

          {activeTab === "usage" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-6 sm:p-8 bg-white border border-border-soft rounded-2xl shadow-soft">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-sage/10 text-sage rounded-xl">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sage-deep">API Requests</h3>
                    <p className="text-xs text-text-muted">Last 30 Days</p>
                  </div>
                </div>
                <div className="h-36 sm:h-40 flex items-end gap-1.5 sm:gap-2 justify-between">
                  {[40, 65, 30, 80, 55, 90, 45, 60, 75, 50, 85, 95].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-full bg-bg-alt rounded-t-lg hover:bg-sage transition-colors cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "docs" && (
            <div className="prose prose-slate max-w-none animate-in fade-in slide-in-from-bottom-2 duration-300 bg-white border border-border-soft rounded-2xl p-6 sm:p-8 shadow-soft">
              <h3 className="text-base font-bold text-sage-deep uppercase tracking-widest mb-4">API Documentation</h3>
              <p className="text-sm text-text-secondary">Welcome to the FlowBoard API reference. Our API is organized around REST.</p>
              <ul className="space-y-2 mt-4">
                {["Authentication", "Workspaces", "Projects & Tasks", "Automations"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sage hover:text-sage-mid font-medium text-sm flex items-center gap-2 no-underline">
                      <ArrowRight className="w-3.5 h-3.5" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-sage/5 p-5 sm:p-6 rounded-2xl border border-sage/20 shadow-soft">
            <h4 className="font-bold text-sage-deep mb-2 flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-sage" />
              Security First
            </h4>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Never expose your API keys in client-side code. Use environment variables and proxy requests through your own backend.
            </p>
          </div>

          <div className="bg-white border border-border-soft rounded-2xl p-5 sm:p-6 shadow-soft space-y-4">
            <h4 className="font-bold text-sage-deep text-sm">Need Help?</h4>
            <ul className="space-y-3">
              {[
                { icon: Code, label: "API Reference" },
                { icon: Terminal, label: "CLI Tools" },
                { icon: ArrowRight, label: "Join Discord Community" },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-xs sm:text-sm text-text-secondary hover:text-sage-deep cursor-pointer transition-colors group">
                  <Icon className="w-4 h-4 text-sage-soft group-hover:text-sage transition-colors" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

function ClientCodeBlock() {
  return (
    <pre className="text-sage-light font-mono text-xs leading-relaxed whitespace-pre-wrap wrap-break-word">
{`curl -X POST https://api.flowboard.app/v1/tasks \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Review Q3 Report",
    "projectId": "proj_123",
    "priority": "HIGH"
  }'`}
    </pre>
  );
}

