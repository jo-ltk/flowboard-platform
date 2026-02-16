"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";

// 1. Editorial Bar Visualization
const EditorialBarChart = ({ data }: { data?: any[] }) => {
  const defaultData = [
    { label: "Mon", value: 65 },
    { label: "Tue", value: 85 },
    { label: "Wed", value: 45 },
    { label: "Thu", value: 92 }, // Peak
    { label: "Fri", value: 70 },
  ];

  const chartData = data || defaultData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="font-syne text-lg font-bold text-deep-blue">Weekly Velocity</h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-deep-blue/40">Unit: Module/hr</span>
      </div>
      <div className="space-y-4">
        {chartData.map((item, i) => (
          <div key={i} className="group flex items-center gap-4">
            <div className="w-8 font-mono text-[10px] font-bold text-deep-blue/40 uppercase">
              {item.label}
            </div>
            <div className="flex-1 h-3 bg-soft-blue/10 rounded-full relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className={cn(
                  "absolute inset-0 rounded-full",
                  item.value > 90 ? "bg-light-green" : "bg-soft-blue"
                )}
              />
            </div>
            <div className="w-8 text-right font-mono text-[10px] font-bold text-deep-blue/60">
              {item.value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Productivity Ring Gauge
const ProductivityRing = ({ value = 78 }: { value?: number }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-surface-sunken/40 border border-border-soft rounded-2xl relative group">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-soft-blue/10"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-soft-blue drop-shadow-[0_0_8px_rgba(149,177,238,0.4)]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-syne text-2xl font-bold text-deep-blue">{value}%</span>
          <span className="font-mono text-[8px] uppercase tracking-tighter text-deep-blue/40">Efficiency</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-[11px] font-semibold text-deep-blue/60 italic">"Above average focus level"</p>
      </div>
    </div>
  );
};

// 3. Timeline Strip
const TimelineStrip = () => {
  const milestones = [
    { label: "Sprint Alpha", date: "Mar 02", pos: 20, status: "completed" },
    { label: "UI Review", date: "Mar 08", pos: 45, status: "active" },
    { label: "Beta Release", date: "Mar 15", pos: 75, status: "pending" },
  ];

  return (
    <TooltipProvider>
      <div className="py-8">
        <div className="relative h-[2px] bg-soft-blue/20 rounded-full">
          {milestones.map((m, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group cursor-pointer"
                  style={{ left: `${m.pos}%` }}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full border-2 border-white shadow-soft transition-all duration-300 group-hover:scale-150",
                    m.status === "completed" ? "bg-light-green" : 
                    m.status === "active" ? "bg-soft-blue animate-pulse" : "bg-white border-soft-blue/30"
                  )} />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-deep-blue border-none text-white text-[10px] font-mono p-2 rounded-lg">
                <div className="font-bold uppercase tracking-wider">{m.label}</div>
                <div className="opacity-60">{m.date}</div>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {/* Progress Overlay */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "45%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 h-full bg-soft-blue rounded-full"
          />
        </div>
        <div className="flex justify-between mt-4">
          <span className="font-mono text-[9px] uppercase tracking-widest text-deep-blue/30">Phase Start</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-deep-blue/30">Phase End</span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export function DataVizSystem({ stats }: { stats?: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Velocity Grid */}
       <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-7 bg-white/40 border border-border-soft rounded-2xl p-8 shadow-soft"
      >
        <EditorialBarChart data={stats?.weeklyVelocity} />
      </motion.div>

      {/* Ring & Stats */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-5 flex flex-col gap-8"
      >
        <ProductivityRing value={stats?.velocity} />
        <div className="flex-1 bg-white/50 border border-border-soft rounded-2xl p-6 flex flex-col justify-center">
          <h4 className="font-syne text-sm font-bold text-deep-blue mb-4 uppercase tracking-widest">Ongoing Timeline</h4>
          <TimelineStrip />
        </div>
      </motion.div>
    </div>
  );
}
