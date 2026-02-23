"use client";

import { useState } from "react";
import WebhookManager from "@/components/system/WebhookManager";
import { Terminal, Copy, Key, Shield, ArrowRight, BarChart3, Code } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState("api-keys");
  const [apiKey, setApiKey] = useState("sk_live_51M0...");
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("API Key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 font-sans text-slate-900 bg-[#FAFAFA] min-h-screen">
      
      {/* Header */}
      <div className="mb-12 border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-serif font-light tracking-tight mb-4">
          Developer <span className="text-slate-400 italic">Platform</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl font-light leading-relaxed">
          Build powerful integrations on top of FlowBoard. Access your data programmatically, 
          listen for real-time events, and extend workspace capabilities.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-200 mb-10 overflow-x-auto">
        {["api-keys", "webhooks", "usage", "docs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-1 text-sm font-medium transition-all relative ${
              activeTab === tab 
              ? "text-slate-900" 
              : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.replace("-", " ").toUpperCase()}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Panel */}
        <div className="lg:col-span-2 space-y-12">
          
          {activeTab === "api-keys" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-white p-8  border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-medium mb-1 flex items-center gap-2">
                      <Key className="w-5 h-5 text-emerald-500" />
                      Production Keys
                    </h3>
                    <p className="text-sm text-slate-500">
                      These keys have full access to your workspace. Keep them secret.
                    </p>
                  </div>
                  <button className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                    Roll Key
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between font-mono text-sm border border-slate-200 group">
                  <span className="text-slate-600 truncate max-w-[300px] blur-[2px] group-hover:blur-none transition-all">
                    {apiKey}
                  </span>
                  <button 
                    onClick={copyKey}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-slate-900"
                  >
                    {copied ? <span className="text-xs font-sans text-emerald-600 font-medium">Copied!</span> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-serif">Quick Start</h3>
                <div className="bg-[#1E1E1E] p-6  text-slate-300 font-mono text-xs overflow-x-auto shadow-xl">
                  <div className="flex gap-2 mb-4 border-b border-white/10 pb-4">
                    <span className="text-emerald-400">cURL</span>
                    <span className="text-slate-500">Node.js</span>
                    <span className="text-slate-500">Python</span>
                  </div>
                  <ClientCodeBlock />
                </div>
              </div>
            </div>
          )}

          {activeTab === "webhooks" && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
               <WebhookManager />
             </div>
          )}

          {activeTab === "usage" && (
            <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="p-6 bg-white border border-slate-200 ">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">API Requests</h3>
                    <p className="text-sm text-slate-500">Last 30 Days</p>
                  </div>
                </div>
                <div className="h-40 flex items-end gap-2 justify-between px-2">
                  {[40, 65, 30, 80, 55, 90, 45, 60, 75, 50, 85, 95].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}%` }} 
                      className="w-full bg-slate-100 rounded-t-md hover:bg-indigo-500 transition-colors"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "docs" && (
             <div className="prose prose-slate max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500">
               <h3>API Documentation</h3>
               <p>Welcome to the FlowBoard API reference. Our API is organized around REST.</p>
               <ul>
                 <li><Link href="#" className="underline decoration-slate-300 underline-offset-4">Authentication</Link></li>
                 <li><Link href="#" className="underline decoration-slate-300 underline-offset-4">Workspaces</Link></li>
                 <li><Link href="#" className="underline decoration-slate-300 underline-offset-4">Projects & Tasks</Link></li>
                 <li><Link href="#" className="underline decoration-slate-300 underline-offset-4">Automations</Link></li>
               </ul>
             </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-emerald-50/50 p-6  border border-emerald-100">
            <h4 className="font-medium text-emerald-900 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security First
            </h4>
            <p className="text-sm text-emerald-800/80 leading-relaxed">
              Never expose your API keys in client-side code. Use environment variables and proxy requests through your own backend.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Need Help?</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors">
                <Code className="w-4 h-4" />
                API Reference
              </li>
              <li className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors">
                <Terminal className="w-4 h-4" />
                CLI Tools
              </li>
              <li className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors">
                <ArrowRight className="w-4 h-4" />
                Join Discord Community
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

function ClientCodeBlock() {
  return (
    <pre className="text-slate-300 font-mono text-xs leading-relaxed">
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
