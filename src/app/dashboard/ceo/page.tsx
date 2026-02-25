"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AnalyticsDashboard } from "@/components/system/AnalyticsDashboard";
import { ExpansionInsights } from "@/components/system/ExpansionInsights";
import { Container } from "@/components/ui/Container";

// Mock Data for CEO Dashboard
const MOCK_ANALYTICS = {
  activeWorkspaces: 142,
  mrr: 12450,
  arr: 149400,
  conversionFunnel: [
    { step: "Workspace Created", count: 1200, dropoffRate: 0 },
    { step: "Project Created", count: 850, dropoffRate: 0.29 },
    { step: "Trial Started", count: 400, dropoffRate: 0.53 },
    { step: "Upgraded", count: 85, dropoffRate: 0.79 },
  ],
  aiUsageDistribution: {
    low: 450,
    medium: 320,
    heavy: 80,
  }
};

const MOCK_SIGNALS = [
  {
    type: "UPGRADE",
    score: 92,
    reason: "3 Workspaces are hitting 95% of their AI token limits this week.",
  },
  {
    type: "ENTERPRISE_CALL",
    score: 88,
    reason: "Design Team Alpha has 25 active members but is on the Architect plan.",
  },
];

export default function CEODashboardPage() {
  const [data] = useState(MOCK_ANALYTICS);

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 fade-in-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border border-border-soft p-6 sm:p-8 shadow-soft rounded-2xl lg:rounded-3xl">
        <div className="absolute top-0 right-0 w-[200px] sm:w-[300px] h-[150px] sm:h-[200px] bg-sage-soft/10 blur-[60px] sm:blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-md bg-sage-deep" />
              <h1 className="text-sm font-bold text-sage-deep uppercase tracking-widest">CEO Command Center</h1>
            </div>
            <p className="text-xs text-text-muted">Executive intelligence. Real-time signals.</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-text-muted uppercase tracking-widest">
            <span>Live</span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      <Container className="space-y-6 sm:space-y-8 px-0!">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KPICard label="MRR" value={`$${data.mrr.toLocaleString()}`} trend="+12%" />
          <KPICard label="ARR" value={`$${data.arr.toLocaleString()}`} trend="+15%" />
          <KPICard label="Active Workspaces" value={data.activeWorkspaces.toString()} trend="+8%" />
        </div>

        {/* Growth Engine */}
        <ExpansionInsights signals={MOCK_SIGNALS as any} />

        {/* Analytics Deep Dive */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-xl font-bold text-sage-deep uppercase tracking-widest">Product Health</h2>
          <AnalyticsDashboard
            conversionFunnel={data.conversionFunnel}
            aiUsageDistribution={data.aiUsageDistribution}
          />
        </div>
      </Container>
    </div>
  );
}

function KPICard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-border-soft bg-white p-5 sm:p-6 shadow-soft hover:shadow-medium hover:border-sage-soft transition-all duration-300"
    >
      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-bold text-sage-deep">{value}</span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 uppercase tracking-widest border border-emerald-100">
          {trend}
        </span>
      </div>
    </motion.div>
  );
}
