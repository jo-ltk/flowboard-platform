"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp, AlertCircle, Zap, Loader2, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { NarrativeReport } from "@/components/system/NarrativeReport";
import { useDemoMode } from "@/context/DemoContext";
import { toast } from "sonner";

interface InsightProps {
  productivity: number;
  risk: number;
  workload: number;
  stats?: any;
}

export function AIInsightPanel({ productivity: initialProductivity = 92, risk: initialRisk = 12, workload: initialWorkload = 74, stats }: Partial<InsightProps>) {
  const { isDemoMode } = useDemoMode();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [hasOptimized, setHasOptimized] = useState(false);
  
  // Initialize metrics state based on props and demo mode
  const [metrics, setMetrics] = useState({
    productivity: stats?.velocity || (isDemoMode ? initialProductivity + 6 : initialProductivity),
    risk: isDemoMode ? Math.max(0, initialRisk - 8) : initialRisk,
    workload: initialWorkload
  });

  const handleOptimize = () => {
    if (hasOptimized) return;
    
    setIsOptimizing(true);
    
    // Simulate complex AI heuristic processing
    setTimeout(() => {
      setIsOptimizing(false);
      setHasOptimized(true);
      
      // Update metrics to show improvement
      setMetrics(prev => ({
        productivity: Math.min(100, prev.productivity + 4),
        risk: Math.max(0, prev.risk - 5),
        workload: Math.max(0, prev.workload - 8)
      }));

      toast.success("Schedule Optimized Successfully", {
        description: "AI has reallocated 4 hours for deep work blocks.",
        duration: 4000,
      });
    }, 2000);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    } as any,
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } as any 
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden bg-cream border border-soft-blue/20 rounded-[16px] p-8 shadow-soft"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-light-green/10 blur-3xl rounded-full -mr-16 -mt-16" />
      
      {/* Top Section */}
      <div className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-syne text-2xl font-bold text-deep-blue">Heuristic Intelligence</h2>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-light-green opacity-75"></span>
              <motion.span 
                animate={{ 
                  boxShadow: ["0 0 0px rgba(231,241,168,0.4)", "0 0 12px rgba(231,241,168,0.8)", "0 0 0px rgba(231,241,168,0.4)"] 
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative inline-flex rounded-full h-2 w-2 bg-light-green"
              />
            </div>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-deep-blue/40">
            Active Neural Context · Version 4.2.0
          </p>
        </div>
        <Badge variant="outline" className="border-deep-blue/10 bg-white/50 text-deep-blue/60 text-[10px] uppercase font-mono px-3">
          Real-time
        </Badge>
      </div>

      {/* Main Content */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Summary Paragraph */}
        <motion.div variants={item} className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-light-green rounded-full opacity-60" />
          <p className="text-deep-blue/80 text-sm leading-relaxed font-medium">
            Project velocity has increased by <span className="text-deep-blue font-bold">14%</span> since the last deploymentcycle.
            Current heuristic analysis suggests shifting focus to <span className="italic">API Integration</span> modules to prevent
            a potential bottleneck detected in the upcoming sprint phase.
          </p>
        </motion.div>

        {/* Strategic Insight Bullets */}
        <div className="space-y-3">
          {[
            { 
              icon: <TrendingUp className="w-3.5 h-3.5" />, 
              text: "Morning focus hours (9-11 AM) show 2.4x higher commit density.", 
              score: metrics.productivity 
            },
            { 
              icon: <Zap className="w-3.5 h-3.5" />, 
              text: "Automation potential identified in 3 repetitive frontend workflows.",
              score: metrics.workload 
            },
            { 
              icon: <AlertCircle className="w-3.5 h-3.5" />, 
              text: "Deadline risk for 'Phase 2' remains low but trending upward (+3%).", 
              score: metrics.risk 
            },
          ].map((bullet, idx) => (
            <motion.div 
              key={idx}
              variants={item}
              className="group flex items-center justify-between p-4 rounded-xl bg-white/40 border border-transparent hover:border-soft-blue/10 hover:bg-white/60 transition-all cursor-default"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-soft-blue/10 flex items-center justify-center text-deep-blue group-hover:scale-110 transition-transform">
                  {bullet.icon}
                </div>
                <span className="text-xs font-semibold text-deep-blue/70 group-hover:text-deep-blue transition-colors">
                  {bullet.text}
                </span>
              </div>
              <div className="font-mono text-[10px] font-bold text-deep-blue/30 group-hover:text-deep-blue/60 transition-colors px-2">
                {idx === 2 ? `-${bullet.score}%` : `+${bullet.score}%`}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Predictive Recommendation Block */}
        <motion.div 
          variants={item}
          className="p-5 rounded-xl bg-deep-blue text-white shadow-medium relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <Sparkles className="w-12 h-12" />
          </div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-soft-blue-light">
              <Zap className="w-3 h-3 fill-current" />
              Strategic Move
            </div>
            <p className="text-sm font-medium leading-relaxed opacity-90">
              Clear 4 hours on Thursday afternoon. Predictive models indicate a high-flow state 
              window for architectural refactoring.
            </p>
          </div>
        </motion.div>

        {/* Action Bottom */}
        <motion.div variants={item} className="pt-2 space-y-3">
          <NarrativeReport />
          <Button 
            onClick={handleOptimize}
            disabled={isOptimizing || hasOptimized}
            className={cn(
              "w-full h-14 border transition-all duration-300 rounded-xl shadow-soft font-syne font-bold group relative overflow-hidden",
              hasOptimized 
                ? "bg-light-green/20 border-light-green text-deep-blue hover:bg-light-green/30" 
                : "bg-white border-soft-blue/20 text-deep-blue hover:bg-soft-blue/5 hover:border-soft-blue/40"
            )}
          >
            <span className={cn("flex items-center justify-center gap-2", isOptimizing && "opacity-0")}>
              {hasOptimized ? (
                <>
                  Schedule Optimized <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Optimize Schedule
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            
            {isOptimizing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-deep-blue" />
              </div>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
