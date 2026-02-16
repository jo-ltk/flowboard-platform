"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Printer, TrendingUp, ShieldCheck, Zap, X, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function NarrativeReportView() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "narrative-report",
          context: {
            workspaceName: "Global Workspace",
            timestamp: new Date().toLocaleDateString(),
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to generate AI report");
      
      setReport(data.data);
    } catch (err: any) {
      console.error("Narrative Report Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 p-12 bg-[#FDFCF7]">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-light-green/30 rounded-full animate-pulse" />
          <Loader2 className="w-16 h-16 text-deep-blue animate-spin relative z-10" />
        </div>
        <div className="text-center space-y-3 relative z-10">
           <p className="font-syne font-black text-xl text-deep-blue uppercase tracking-tighter">Synthesizing Workspace State</p>
           <p className="font-mono text-[10px] text-deep-blue/40 uppercase tracking-[0.4em] animate-pulse">Large Language Model Orchestration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-12 text-center space-y-6 bg-[#FDFCF7]">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <X className="w-10 h-10 text-red-400" />
        </div>
        <div className="space-y-2">
          <p className="text-deep-blue font-bold text-lg">Orchestration Interrupted</p>
          <p className="text-deep-blue/50 text-sm max-w-md mx-auto">{error}</p>
        </div>
        <button onClick={fetchReport} className="px-8 py-3 bg-deep-blue text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">Re-attempt Synthesis</button>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-deep-blue selection:bg-light-green/20 pb-20">
      {/* Top Header/Nav */}
      <div className="sticky top-0 z-50 bg-[#FDFCF7]/95 backdrop-blur-md border-b border-deep-blue/5 px-6 md:px-12 py-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-2 hover:bg-deep-blue/5 rounded-full transition-colors text-deep-blue/40 hover:text-deep-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-8 w-px bg-deep-blue/5" />
          <div className="space-y-0.5">
            <h1 className="font-instrument-serif text-2xl md:text-3xl italic leading-none">Executive Narrative</h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-deep-blue/30">
              Confidential · AI-Synthesized Intelligence · {new Date().getFullYear()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-deep-blue/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-deep-blue/40 hover:text-deep-blue transition-all">
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-deep-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-deep-blue-dark transition-all shadow-lg shadow-deep-blue/20">
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-12 py-12 md:py-20 lg:py-24 space-y-20 md:space-y-32">
        {/* Summary Section */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h3 className="font-syne font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-deep-blue/20 mb-6 md:mb-10 flex items-center gap-4">
            <span className="w-8 md:w-12 h-px bg-deep-blue/10" />
            01. Strategic Summary
          </h3>
          <div className="relative">
            <p className="font-instrument-serif text-2xl md:text-4xl lg:text-5xl leading-[1.3] text-deep-blue/90 first-letter:text-7xl md:first-letter:text-8xl lg:first-letter:text-9xl first-letter:font-bold first-letter:mr-4 md:first-letter:mr-6 first-letter:float-left first-letter:text-deep-blue first-letter:leading-[0.8] first-letter:mt-1">
              {report.summary}
            </p>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="animate-in fade-in slide-in-from-bottom-8 delay-300 duration-1000">
          <h3 className="font-syne font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-deep-blue/20 mb-6 md:mb-10 flex items-center gap-4">
            <span className="w-8 md:w-12 h-px bg-deep-blue/10" />
            02. Performance Deltas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {[
              { label: "Productivity Delta", val: `+${report.productivityDelta}%`, desc: "Commit density & PR throughput", icon: <TrendingUp className="w-4 h-4 text-light-green" /> },
              { label: "Risk Mitigation", val: `-${report.riskReduction}%`, desc: "Predicted bottleneck bypass", icon: <ShieldCheck className="w-4 h-4 text-soft-blue" /> },
              { label: "Autonomy Yield", val: `${report.timeSaved}h`, desc: "Repetitive task automation", icon: <Zap className="w-4 h-4 text-light-green" /> },
              { label: "Capital Efficiency", val: `$${report.automationSavings.toLocaleString()}`, desc: "Normalized engineering cost", icon: null }
            ].map((metric, i) => (
               <div key={i} className="group border-l border-deep-blue/10 pl-6 py-2 hover:border-light-green transition-all duration-500">
                  <p className="font-mono text-[9px] text-deep-blue/40 uppercase mb-2 tracking-[0.15em] font-bold">{metric.label}</p>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl md:text-4xl lg:text-5xl font-syne font-black text-deep-blue group-hover:text-light-green transition-colors leading-none tracking-tighter">{metric.val}</span>
                    {metric.icon && <div className="p-1 px-1.5 bg-white shadow-sm border border-deep-blue/5 rounded-md shrink-0 translate-y-[-4px]">{metric.icon}</div>}
                  </div>
                  <p className="text-[10px] font-medium text-deep-blue/40 uppercase tracking-wide leading-relaxed">{metric.desc}</p>
               </div>
            ))}
          </div>
        </section>

        {/* Key Insights Section */}
        <section className="bg-deep-blue p-8 md:p-20 lg:p-24 rounded-[40px] md:rounded-[60px] lg:rounded-[80px] shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 delay-500 duration-1000">
          <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-soft-blue/5 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-soft-blue/10 blur-[120px] rounded-full pointer-events-none" />
          
          <h3 className="font-syne font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/40 mb-12 md:mb-16 relative z-10 flex items-center gap-6">
            <span className="w-12 h-px bg-white/20" />
            03. Neural Insights
          </h3>
          <div className="space-y-10 md:space-y-14 relative z-10">
            {report.topInsights.map((insight: string, idx: number) => (
              <div key={idx} className="flex gap-6 md:gap-10 items-start pb-10 md:pb-14 border-b border-white/5 last:border-0 group hover:border-white/10 transition-all">
                <span className="font-mono text-[10px] text-white/20 mt-2 font-black">[{String(idx + 1).padStart(2, '0')}]</span>
                <p className="text-white/80 font-syne font-semibold text-xl md:text-2xl lg:text-3xl group-hover:text-white transition-all leading-snug tracking-tight max-w-3xl">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Section */}
        <section className="pt-20 pb-8 flex flex-col items-center text-center space-y-10 animate-in fade-in duration-1000">
           <div className="inline-flex items-center gap-4 px-6 py-3 bg-deep-blue/5 rounded-full border border-deep-blue/5">
              <Sparkles className="w-4 h-4 text-deep-blue/30" />
              <span className="font-instrument-serif font-bold text-2xl italic tracking-tight">FlowBoard Intelligence</span>
           </div>
           
           <div className="space-y-3">
              <p className="font-mono text-[9px] text-deep-blue/30 uppercase tracking-[0.5em] font-black">
                LEGAL ATTESTATION
              </p>
              <p className="max-w-xl text-[10px] font-medium text-deep-blue/40 leading-relaxed uppercase tracking-widest px-4">
                This report is autonomously generated by FlowBoard V4 Neural Orchestration. 
                Data points are synthesized from active workspace telemetry and verified through 
                multi-agent consensus. Distribution is limited to authorized stakeholders.
              </p>
           </div>
        </section>
      </div>
    </div>
  );
}
