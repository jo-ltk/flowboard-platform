"use client";

import { useState } from "react";
import { AVAILABLE_INTEGRATIONS, IntegrationDefinition } from "@/types/integration";
import { Plug, Check, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Mock Icons
const Icons = {
  slack: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.523v-6.312zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52h-2.521zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H3.784A2.528 2.528 0 0 1 1.263 8.834a2.528 2.528 0 0 1 2.52-2.521h5.05zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>
  ),
  github: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
  ),
  calendar: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  ),
  notion: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M4.459 4.208c.746.606 1.026.568 2.492.568h11.238c.677 0 1.353-.086 1.353-.889V1.455L24 1.458v20.478c-1.488.756-3.882 1.32-5.748 1.32-4.043 0-8.23-1.616-11.956-3.327l-.467-6.039L1.442,4.832V1.954l3.017.254V4.208Zm2.622,12.064c-.139,2.836-.614,5.157,1.801,5.157,2.298,0,5.782-4.881,5.782-9.619,0-3.303-1.621-4.83-3.669-4.83-2.923,0-3.914,6.974-3.914,9.292Z"/></svg>
  ),
};

export default function IntegrationsPage() {
  // In a real app, fetch this from the API
  const [connected, setConnected] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const toggleIntegration = async (id: string) => {
    setLoading(id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (connected.includes(id)) {
      setConnected(connected.filter(c => c !== id));
      toast.success(`Disconnected ${id}`);
    } else {
      setConnected([...connected, id]);
      toast.success(`Connected to ${id}`);
    }
    
    setLoading(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in duration-500">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">App Marketplace</h1>
        <p className="text-lg text-slate-500 max-w-2xl">
          Supercharge your workflow by connecting FlowBoard with your favorite tools.
          Automate tasks, sync calendars, and streamline communication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_INTEGRATIONS.map((app) => (
          <div
            key={app.id}
            className="group flex flex-col p-6 bg-white border border-slate-200  hover:border-slate-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
          >
            {/* Background gradient for connected state */}
            {connected.includes(app.id) && (
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/50 to-transparent pointer-events-none" />
            )}

            <div className="flex items-start justify-between mb-6 relative">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 ${
                connected.includes(app.id) ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"
              }`}>
                {(() => {
                  const Icon = Icons[app.icon as keyof typeof Icons];
                  return Icon ? <Icon className="w-7 h-7" /> : <Plug />;
                })()}
              </div>
              {connected.includes(app.id) && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/50 text-emerald-700 rounded-full text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  Connected
                </div>
              )}
            </div>

            <div className="space-y-2 mb-8 flex-1 relative">
              <h3 className="text-lg font-semibold text-slate-900">{app.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {app.description}
              </p>
            </div>

            <div className="mt-auto relative">
              <button
                onClick={() => toggleIntegration(app.id)}
                disabled={loading === app.id}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  connected.includes(app.id)
                    ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-red-600 hover:border-red-200"
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md"
                }`}
              >
                {loading === app.id ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : connected.includes(app.id) ? (
                  "Disconnect"
                ) : (
                  <>
                    Connect <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
