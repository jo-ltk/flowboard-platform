"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";

// 1. Editorial Bar Visualization (Horizontal)
const EditorialBarChart = ({ data }: { data?: any[] }) => {
  const defaultData = [
    { label: "Mon", value: 65 },
    { label: "Tue", value: 85 },
    { label: "Wed", value: 45 },
    { label: "Thu", value: 92 },
    { label: "Fri", value: 70 },
  ];

  const chartData = data || defaultData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="font-semibold text-base text-[#2F3A35]">Weekly Velocity</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96]">Flow Score™</span>
      </div>
      <div className="space-y-4">
        {chartData.map((item, i) => (
          <div key={i} className="group flex items-center gap-4">
            <div className="w-8 text-[10px] font-bold text-[#8A9E96] uppercase tracking-wide">
              {item.label}
            </div>
            <div className="flex-1 h-2 bg-[#E9EFEC] rounded-full relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className={cn(
                  "absolute inset-0 rounded-full transition-colors duration-300",
                  item.value > 90 ? "bg-[#7C9A8B]" : "bg-[#AFC8B8]"
                )}
              />
            </div>
            <div className="w-8 text-right text-[10px] font-bold text-[#5C6B64] tabular-nums">
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
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#F4F7F5] border border-[#DDE5E1]  relative group hover:border-[#AFC8B8] transition-all duration-300">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="7"
            fill="transparent"
            className="text-[#DDE5E1]"
          />
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="7"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-[#7C9A8B] drop-shadow-[0_0_4px_rgba(124,154,139,0.2)]"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[#2F3A35] leading-none">{value}%</span>
          <span className="text-[9px] font-bold uppercase tracking-tight text-[#8A9E96] mt-1">Efficiency</span>
        </div>
      </div>
      <div className="mt-5 text-center px-2">
        <p className="text-[11px] font-medium text-[#5C6B64] italic">&ldquo;Above average focus level&rdquo;</p>
      </div>
    </div>
  );
};

// 3. Timeline Strip
const TimelineStrip = () => {
  const milestones = [
    { label: "Concept", date: "Mar 02", pos: 20, status: "completed" },
    { label: "Review",  date: "Mar 08", pos: 45, status: "active" },
    { label: "Launch",  date: "Mar 15", pos: 75, status: "pending" },
  ];

  return (
    <TooltipProvider>
      <div className="py-6 sm:py-8">
        <div className="relative h-[2px] bg-[#DDE5E1] rounded-full">
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
                    "w-3.5 h-3.5 rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:scale-125",
                    m.status === "completed" ? "bg-[#7C9A8B]" : 
                    m.status === "active" ? "bg-[#AFC8B8] ring-4 ring-[#AFC8B8]/20" : "bg-white border-[#DDE5E1]"
                  )} />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-[#2F3A35] border-none text-white text-[10px] font-medium p-2.5 rounded-xl shadow-xl">
                <div className="font-bold uppercase tracking-wider">{m.label}</div>
                <div className="opacity-60 text-[9px] mt-0.5">{m.date}</div>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {/* Progress Overlay */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "45%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 left-0 h-full bg-[#AFC8B8]"
          />
        </div>
        <div className="flex justify-between mt-5">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8A9E96]">Phase Start</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8A9E96]">Phase End</span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export function DataVizSystem({ stats }: { stats?: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
      {/* Velocity Grid */}
       <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="lg:col-span-12 xl:col-span-7 bg-white/50 border border-[#DDE5E1] rounded-2xl p-6 sm:p-8"
      >
        <EditorialBarChart data={stats?.weeklyVelocity} />
      </motion.div>

      {/* Ring & Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6"
      >
        <ProductivityRing value={stats?.velocity} />
        <div className="flex-1 bg-white/40 border border-[#DDE5E1]  p-6 flex flex-col justify-center hover:border-[#AFC8B8] transition-all duration-300 shadow-sm">
          <h4 className="text-[10px] font-bold text-[#8A9E96] uppercase tracking-[0.15em] mb-1">Ongoing Timeline</h4>
          <TimelineStrip />
        </div>
      </motion.div>
    </div>
  );
}
