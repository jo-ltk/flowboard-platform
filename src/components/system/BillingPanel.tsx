
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Users, Brain, Activity, ArrowRight, Info, AlertTriangle, PartyPopper, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { useSearchParams } from 'next/navigation';
import { PLAN_CONFIGS, WorkspaceMetadata, PlanType, UserRole } from '@/types/workspace';

interface BillingPanelProps {
  workspace: WorkspaceMetadata;
}

export const BillingPanel = ({ workspace }: BillingPanelProps) => {
  const plans = Object.values(PLAN_CONFIGS);
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const upgradedPlan = searchParams.get('upgraded');
  const isMockMode = workspace.id.startsWith('ws-');

  // If we just upgraded in mock mode, temporarily "faking" the workspace state
  const displayPlan = (isSuccess && upgradedPlan) ? upgradedPlan.toLowerCase() : workspace.plan.type.toLowerCase();

  // Calculate limits based on the displayed plan for mock mode visual consistency
  const currentPlanConfig = PLAN_CONFIGS[displayPlan as PlanType] || PLAN_CONFIGS.starter;
  const aiLimit = currentPlanConfig.aiTokenLimit;
  const autoLimit = currentPlanConfig.automationLimit;
  const membersLimit = currentPlanConfig.memberLimit;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">
      {/* Mock Mode & Success Banners */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            key="success-banner"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-emerald-50 border border-emerald-200  p-4 flex items-center gap-4 text-emerald-800 mb-8"
          >
            <div className="bg-emerald-500 text-white p-2 rounded-full">
              <PartyPopper size={20} />
            </div>
            <div>
              <p className="font-bold">Upgrade Successful!</p>
              <p className="text-sm opacity-90">Your workspace has been moved to the <span className="uppercase font-black">{upgradedPlan}</span> plan.</p>
            </div>
          </motion.div>
        )}

        {isMockMode && (
          <motion.div 
            key="mock-banner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-50 border border-amber-200  p-4 flex items-start gap-4 text-amber-800 mb-8"
          >
            <div className="bg-amber-500 text-white p-2 rounded-full mt-0.5 shrink-0">
              <Info size={16} />
            </div>
            <div>
              <p className="font-bold text-sm">Developer Mock Mode Active</p>
              <p className="text-xs opacity-90 leading-relaxed">
                You are currently using a <strong>Mock Workspace ({workspace.id})</strong>. 
                Changes will not persist in the database, and Stripe is bypassed. 
                <br />
                <span className="font-bold">To see the real Stripe Checkout:</span> Update <code>STRIPE_SECRET_KEY</code> in your <code>.env.local</code> with a real key.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Plan Overview */}
      <section className="bg-white border border-stone-200/60 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Usage & Capacity</h2>
            <p className="text-stone-500 font-medium">Monitoring resources for <span className="text-blue-600">"{workspace.name}"</span></p>
          </div>
          <div className="inline-flex flex-col items-end gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Current Plan</span>
              <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100 text-sm font-bold uppercase tracking-wide">
                {displayPlan}
              </div>
            </div>
            
            <button 
              onClick={async () => {
                try {
                  const res = await fetch('/api/billing/portal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ workspaceId: workspace.id })
                  });
                  const { url } = await res.json();
                  window.location.href = url;
                } catch (e) {
                  toast.error("Could not open billing portal.");
                }
              }}
              className="group flex items-center gap-2 text-[10px] font-bold text-stone-400 hover:text-stone-600 uppercase tracking-widest transition-colors"
            >
              <CreditCard size={12} className="group-hover:text-blue-500 transition-colors" />
              <span>Payment Methods & Invoices</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* AI Usage */}
          <UsageMeter 
            icon={Brain} 
            label="AI Insight Tokens" 
            used={workspace.aiUsage.tokensUsed} 
            limit={aiLimit} 
            color="blue"
          />
          {/* Automations */}
          <UsageMeter 
            icon={Zap} 
            label="Automations Executed" 
            used={workspace.automationUsage.executed} 
            limit={autoLimit} 
            color="emerald"
          />
          {/* Members */}
          <UsageMeter 
            icon={Users} 
            label="Workspace Members" 
            used={workspace.memberCount} 
            limit={membersLimit} 
            color="amber"
          />
        </div>
      </section>

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {plans.map((plan, idx) => (
          <div key={plan.type} className={cn(
            "flex",
            idx === 2 && "md:col-span-2 lg:col-span-1 md:max-w-lg md:mx-auto lg:max-w-none lg:mx-0 w-full"
          )}>
            <PlanCard 
              plan={plan} 
              isCurrent={displayPlan === plan.type} 
              role={workspace.role}
              workspaceId={workspace.id}
            />
          </div>
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
    <div className="space-y-4 p-5  bg-stone-50/50 border border-stone-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-white shadow-sm", color === 'blue' ? 'text-blue-600' : color === 'emerald' ? 'text-emerald-600' : 'text-amber-600')}>
            <Icon size={18} />
          </div>
          <span className="text-sm font-bold text-stone-700">{label}</span>
        </div>
        <span className="text-xs font-bold text-stone-500">
          {limit === -1 ? 'Unlimited' : `${used.toLocaleString('en-US')} / ${limit.toLocaleString('en-US')}`}
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

const PlanCard = ({ plan, isCurrent, role, workspaceId }: { plan: any, isCurrent: boolean, role: UserRole, workspaceId: string }) => {
  const [loading, setLoading] = React.useState(false);

  const handleUpgrade = async () => {
    if (isCurrent || loading) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
          planType: plan.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('[Billing] Error:', error);
      toast.error("Failed to start checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "relative p-6 sm:p-8 rounded-3xl border-2 transition-all duration-500 flex flex-col w-full",
      isCurrent 
        ? "bg-white border-blue-500 shadow-xl shadow-blue-100/50 scale-[1.02] z-10" 
        : "bg-white border-stone-100 hover:border-stone-200"
    )}>
      {isCurrent && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
          Active Plan
        </div>
      )}
      
      <div className="mb-6 sm:mb-8">
        <h3 className="text-sm sm:text-lg font-bold text-stone-900 uppercase tracking-widest mb-1 truncate">{plan.type}</h3>
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-3xl sm:text-4xl font-black text-stone-900">{plan.price}</span>
          <span className="text-stone-500 font-medium text-xs sm:text-sm">/workspace</span>
        </div>
      </div>

      <ul className="space-y-4 mb-10">
        <FeatureItem label={`${plan.aiTokenLimit === -1 ? 'Unlimited' : plan.aiTokenLimit.toLocaleString('en-US')} AI Tokens`} />
        <FeatureItem label={`${plan.automationLimit === -1 ? 'Unlimited' : plan.automationLimit} Automations`} />
        <FeatureItem label={`${plan.memberLimit === -1 ? 'Unlimited' : plan.memberLimit} Seats`} />
        <FeatureItem label="Advanced Insight Engine" />
      </ul>

      <AccessGate role={role} action="billing_access" showBlur={false}>
        <button 
          onClick={handleUpgrade}
          disabled={loading || isCurrent}
          className={cn(
            "w-full py-4  font-bold flex items-center justify-center gap-2 transition-all",
            isCurrent 
              ? "bg-stone-200 text-stone-500 cursor-default" 
              : "bg-stone-900 text-white hover:bg-stone-800 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          )}
        >
          {loading ? "Processing..." : isCurrent ? "Current Plan" : "Upgrade to " + plan.type}
          {!isCurrent && !loading && <ArrowRight size={18} />}
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
