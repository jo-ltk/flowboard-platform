
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Users, Brain, Activity, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { PLAN_CONFIGS, WorkspaceMetadata, PlanType, UserRole } from '@/types/workspace';

interface BillingPanelProps {
  workspace: WorkspaceMetadata;
}

export const BillingPanel = ({ workspace }: BillingPanelProps) => {
  const plans = Object.values(PLAN_CONFIGS);

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Current Plan Overview */}
      <section className="bg-white border border-stone-200/60 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Usage & Capacity</h2>
            <p className="text-stone-500 font-medium">Monitoring resources for <span className="text-blue-600">"{workspace.name}"</span></p>
          </div>
          <div className="inline-flex flex-col items-end">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Current Plan</span>
            <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100 text-sm font-bold uppercase tracking-wide">
              {workspace.plan.type}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* AI Usage */}
          <UsageMeter 
            icon={Brain} 
            label="AI Insight Tokens" 
            used={workspace.aiUsage.tokensUsed} 
            limit={workspace.aiUsage.tokensLimit} 
            color="blue"
          />
          {/* Automations */}
          <UsageMeter 
            icon={Zap} 
            label="Automations Executed" 
            used={workspace.automationUsage.executed} 
            limit={workspace.automationUsage.limit} 
            color="emerald"
          />
          {/* Members */}
          <UsageMeter 
            icon={Users} 
            label="Workspace Members" 
            used={workspace.memberCount} 
            limit={workspace.plan.memberLimit} 
            color="amber"
          />
        </div>
      </section>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PlanCard 
            key={plan.type} 
            plan={plan} 
            isCurrent={workspace.plan.type === plan.type} 
            role={workspace.role}
          />
        ))}
      </div>

      {/* Features Comparison Table */}
      <section className="overflow-hidden rounded-3xl border border-stone-200/60 bg-white shadow-sm">
        <div className="p-8 border-b border-stone-100">
          <h3 className="text-xl font-bold text-stone-900Condensed">Editorial Plan Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50">
                <th className="p-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Feature</th>
                <th className="p-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Starter</th>
                <th className="p-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Architect</th>
                <th className="p-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <ComparisonRow label="AI Narrative Reports" values={['Basic', 'Advanced', 'Executive']} />
              <ComparisonRow label="Real-time Presence" values={[true, true, true]} />
              <ComparisonRow label="Custom Automations" values={['5 max', '50 max', 'Unlimited']} />
              <ComparisonRow label="Data Separation" values={['Software', 'Dedicated', 'Sovereign']} />
              <ComparisonRow label="Support" values={['Community', 'Priority', 'White-glove 24/7']} />
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const UsageMeter = ({ icon: Icon, label, used, limit, color }: any) => {
  const percentage = limit === -1 ? 0 : Math.min((used / limit) * 100, 100);
  const colorClasses = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  };

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-stone-50/50 border border-stone-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-white shadow-sm", color === 'blue' ? 'text-blue-600' : color === 'emerald' ? 'text-emerald-600' : 'text-amber-600')}>
            <Icon size={18} />
          </div>
          <span className="text-sm font-bold text-stone-700">{label}</span>
        </div>
        <span className="text-xs font-bold text-stone-500">
          {limit === -1 ? 'Unlimited' : `${used.toLocaleString()} / ${limit.toLocaleString()}`}
        </span>
      </div>
      <div className="h-2 w-full bg-stone-200/50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClasses[color as keyof typeof colorClasses])}
        />
      </div>
    </div>
  );
};

import { AccessGate } from './AccessGate';

const PlanCard = ({ plan, isCurrent, role }: { plan: any, isCurrent: boolean, role: UserRole }) => {
  return (
    <div className={cn(
      "relative p-8 rounded-3xl border-2 transition-all duration-500",
      isCurrent 
        ? "bg-stone-50/50 border-blue-200 shadow-xl shadow-blue-50" 
        : "bg-white border-stone-100 hover:border-stone-200"
    )}>
      {isCurrent && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
          Active Plan
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-lg font-bold text-stone-900 uppercase tracking-widest mb-1">{plan.type}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-stone-900">{plan.price}</span>
          <span className="text-stone-500 font-medium text-sm">/workspace</span>
        </div>
      </div>

      <ul className="space-y-4 mb-10">
        <FeatureItem label={`${plan.aiTokenLimit === -1 ? 'Unlimited' : plan.aiTokenLimit.toLocaleString()} AI Tokens`} />
        <FeatureItem label={`${plan.automationLimit === -1 ? 'Unlimited' : plan.automationLimit} Automations`} />
        <FeatureItem label={`${plan.memberLimit === -1 ? 'Unlimited' : plan.memberLimit} Seats`} />
        <FeatureItem label="Advanced Insight Engine" />
      </ul>

      <AccessGate role={role} action="billing_access" showBlur={false}>
        <button 
          onClick={() => {
            if (!isCurrent) {
              console.log(`[BillingPanel] Upgrade clicked for plan: ${plan.type}`);
              toast.success(`Redirecting to ${plan.type} checkout...`);
            }
          }}
          className={cn(
            "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
            isCurrent 
              ? "bg-stone-200 text-stone-500 cursor-default" 
              : "bg-stone-900 text-white hover:bg-stone-800 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          )}
        >
          {isCurrent ? "Current Plan" : "Upgrade to " + plan.type}
          {!isCurrent && <ArrowRight size={18} />}
        </button>
      </AccessGate>
    </div>
  );
};


const FeatureItem = ({ label }: { label: string }) => (
  <li className="flex items-start gap-3">
    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
      <Check size={12} strokeWidth={3} />
    </div>
    <span className="text-sm font-medium text-stone-600">{label}</span>
  </li>
);

const ComparisonRow = ({ label, values }: { label: string, values: any[] }) => (
  <tr>
    <td className="p-6 text-sm font-bold text-stone-700">{label}</td>
    {values.map((v, i) => (
      <td key={i} className="p-6 text-sm text-stone-500">
        {typeof v === 'boolean' ? (
          v ? <Check size={16} className="text-emerald-500" /> : "—"
        ) : v}
      </td>
    ))}
  </tr>
);
