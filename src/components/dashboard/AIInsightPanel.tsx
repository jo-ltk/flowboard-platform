"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
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
  
  const [metrics, setMetrics] = useState({
    productivity: stats?.velocity || (isDemoMode ? initialProductivity + 6 : initialProductivity),
    risk: isDemoMode ? Math.max(0, initialRisk - 8) : initialRisk,
    workload: initialWorkload
  });

  const handleOptimize = () => {
    if (hasOptimized) return;
    setIsOptimizing(true);
    
    setTimeout(() => {
      setIsOptimizing(false);
      setHasOptimized(true);
      setMetrics(prev => ({
        productivity: Math.min(100, prev.productivity + 4),
        risk: Math.max(0, prev.risk - 5),
        workload: Math.max(0, prev.workload - 8)
      }));

      toast.success("Schedule Balanced", {
        description: "Focus blocks have been intelligently reallocated.",
        duration: 4000,
      });
    }, 2000);
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden bg-white border border-[#DDE5E1]  p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#AFC8B8]/12 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
      
      {/* Top Section */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-[#2F3A35]">Flow Insights</h2>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C9A8B] opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C9A8B]" />
            </div>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-[#8A9E96]">
            Intelligent Balance Active
          </p>
        </div>
        <Badge variant="outline" className="border-[#DDE5E1] bg-[#F4F7F5] text-[#5C6B64] text-[9px] uppercase font-semibold px-2.5 py-1 tracking-wider">
          Live
        </Badge>
      </div>

      {/* Main Content */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Summary Paragraph */}
        <motion.div variants={item} className="relative pl-5">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#AFC8B8] rounded-full opacity-60" />
          <p className="text-[#5C6B64] text-[13px] leading-relaxed font-medium">
            Project velocity is up by <span className="text-[#2F3A35] font-bold">14%</span>.
            We suggest dedicating Thursday for <span className="italic text-[#7C9A8B]">deep work</span> to maintain this momentum and clear upcoming bottlenecks.
          </p>
        </motion.div>

        {/* Strategic Insight Bullets */}
        <div className="space-y-2.5">
          {[
            { 
              icon: <TrendingUp className="w-3.5 h-3.5" />, 
              text: "Morning flow state (9-11 AM) remains most effective.", 
              score: metrics.productivity 
            },
            { 
              icon: <Zap className="w-3.5 h-3.5" />, 
              text: "Found workflow optimizations for team collaboration.",
              score: metrics.workload 
            },
            { 
              icon: <AlertCircle className="w-3.5 h-3.5" />, 
              text: "Timeline risk remains low; stability trending upward.", 
              score: metrics.risk 
            },
          ].map((bullet, idx) => (
            <motion.div 
              key={idx}
              variants={item}
              className="group flex items-center justify-between p-3.5 rounded-xl bg-[#F4F7F5]/50 border border-transparent hover:border-[#DDE5E1] hover:bg-white transition-all cursor-default"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#DDE5E1] flex items-center justify-center text-[#7C9A8B] group-hover:scale-105 transition-transform">
                  {bullet.icon}
                </div>
                <span className="text-xs font-semibold text-[#5C6B64] group-hover:text-[#2F3A35] transition-colors">
                  {bullet.text}
                </span>
              </div>
              <div className="text-[10px] font-bold text-[#8A9E96] group-hover:text-[#5C6B64] transition-colors tabular-nums">
                {idx === 2 ? `-${bullet.score}%` : `+${bullet.score}%`}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Predictive Recommendation Block */}
        <motion.div 
          variants={item}
          className="p-5 rounded-xl bg-[#2F3A35] text-white shadow-md relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Sparkles className="w-10 h-10 text-[#AFC8B8]" />
          </div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#AFC8B8]">
              <Zap className="w-3 h-3 fill-current" />
              Strategic Shift
            </div>
            <p className="text-[13px] font-medium leading-relaxed text-white/90">
              Clear 4 hours on Thursday. It looks like an ideal window for 
              high-focus creative tasks.
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
              "w-full h-12 flex items-center justify-center gap-2.5 rounded-xl font-bold text-[13px] transition-all duration-300",
              hasOptimized 
                ? "bg-[#7C9A8B]/15 border-[#7C9A8B]/30 text-[#5F7D6E] hover:bg-[#7C9A8B]/25" 
                : "bg-white border-[#DDE5E1] text-[#2F3A35] hover:bg-[#F4F7F5] hover:border-[#AFC8B8]"
            )}
          >
            <span className={cn("flex items-center gap-2", isOptimizing && "opacity-0")}>
              {hasOptimized ? (
                <>
                  Schedule Balanced <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Balance Schedule
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </span>
            
            {isOptimizing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[#7C9A8B]" />
              </div>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
