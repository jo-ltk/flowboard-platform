"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ExpansionInsightsProps {
  signals: {
    type: "UPGRADE" | "ADD_SEATS" | "AUTOMATION_ADDON" | "ENTERPRISE_CALL";
    score: number;
    reason: string;
  }[];
}

export function ExpansionInsights({ signals }: ExpansionInsightsProps) {
  if (signals.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className=" border border-indigo-100 bg-indigo-50/50 p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-indigo-950">Growth Opportunities</h2>
          <p className="text-indigo-600/80 font-medium">AI-detected expansion signals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {signals.map((signal, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative overflow-hidden rounded-xl border border-white/60 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                {signal.type === "UPGRADE" && <Zap className="h-4 w-4 text-amber-500" />}
                {signal.type === "ADD_SEATS" && <Target className="h-4 w-4 text-emerald-500" />}
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {signal.type.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold">
                {signal.score}% Match
              </div>
            </div>

            <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4">
              {signal.reason}
            </p>

            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-between group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors"
            >
              Take Action
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
            </Button>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
