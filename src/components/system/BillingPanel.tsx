
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
      <section className="bg-white border border-border-soft rounded-2xl p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-sage-deep tracking-tight">Usage & Capacity</h2>
            <p className="text-text-secondary font-medium text-sm">Monitoring resources for <span className="text-sage font-bold">"{workspace.name}"</span></p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex flex-col items-start md:items-end">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Current Plan</span>
              <div className="bg-sage/10 text-sage-deep px-4 py-1.5 rounded-full border border-sage/20 text-sm font-bold uppercase tracking-wide">
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
              className="group flex items-center gap-2 text-[10px] font-bold text-text-muted hover:text-text-secondary uppercase tracking-widest transition-colors"
            >
              <CreditCard size={12} className="group-hover:text-sage transition-colors" />
              <span>Payment Methods & Invoices</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-10">
          {/* AI Usage */}
          <UsageMeter 
            icon={Brain} 
            label="AI Insight Tokens" 
            used={workspace.aiUsage.tokensUsed} 
            limit={aiLimit} 
            color="sage"
          />
          {/* Automations */}
          <UsageMeter 
            icon={Zap} 
            label="Automations" 
            used={workspace.automationUsage.executed} 
            limit={autoLimit} 
            color="sage-mid"
          />
          {/* Members */}
          <UsageMeter 
            icon={Users} 
            label="Team Seats" 
            used={workspace.memberCount} 
            limit={membersLimit} 
            color="sage-soft"
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
      <section className="overflow-hidden rounded-2xl border border-border-soft bg-white shadow-soft">
        <div className="p-6 sm:p-8 border-b border-border-soft bg-surface-primary/50">
          <h3 className="text-lg font-bold text-sage-deep uppercase tracking-widest">Protocol Matrix</h3>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-primary/30 border-b border-border-soft">
                <th className="p-5 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Platform Logic</th>
                <th className="p-5 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Starter</th>
                <th className="p-5 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Architect</th>
                <th className="p-5 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft/50">
              <ComparisonRow label="AI Narrative Reports" values={['Basic', 'Advanced', 'Executive']} />
              <ComparisonRow label="Real-time Presence" values={[true, true, true]} />
              <ComparisonRow label="Custom Automations" values={['5 max', '50 max', 'Unlimited']} />
              <ComparisonRow label="Data Separation" values={['Software', 'Dedicated', 'Sovereign']} />
              <ComparisonRow label="Support" values={['Community', 'Priority', 'White-glove']} />
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
    sage: "bg-sage",
    "sage-mid": "bg-sage-mid",
    "sage-soft": "bg-sage-soft",
  };

  return (
    <div className="space-y-4 p-5 sm:p-6 rounded-2xl bg-surface-primary/30 border border-border-soft hover:bg-white hover:shadow-medium hover:border-sage-soft transition-all duration-300 group">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            "p-2 rounded-xl bg-white shadow-soft shrink-0 transition-transform group-hover:scale-110 duration-500", 
            color === 'sage' ? 'text-sage' : color === 'sage-mid' ? 'text-sage-mid' : 'text-sage-soft'
          )}>
            <Icon size={16} />
          </div>
          <span className="text-xs sm:text-sm font-bold text-sage-deep truncate uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-[10px] font-bold text-text-muted whitespace-nowrap tabular-nums bg-white px-2 py-0.5 rounded-lg border border-border-soft shadow-soft shrink-0">
          {limit === -1 ? '∞' : `${(used || 0).toLocaleString('en-US')} / ${(limit || 0).toLocaleString('en-US')}`}
        </span>
      </div>
      <div className="h-1.5 w-full bg-bg-alt rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className={cn("h-full rounded-full transition-all", colorClasses[color as keyof typeof colorClasses])}
        />
      </div>
    </div>
  );
};

import GooglePayButton from "@google-pay/button-react";
import { AccessGate } from './AccessGate';

const PlanCard = ({ plan, isCurrent, role, workspaceId }: { plan: any, isCurrent: boolean, role: UserRole, workspaceId: string }) => {
  const [loading, setLoading] = React.useState(false);
  const [showGPay, setShowGPay] = React.useState(false);

  const handleUpgradeClick = () => {
    if (isCurrent || loading) return;
    
    // For paid plans, show GPay instead of immediate redirect
    if (plan.price !== "$0") {
      setShowGPay(true);
    } else {
      // Free plan logic if applicable
      toast.info("You're already on a free plan, or contact support to downgrade.");
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
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-sage-deep text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-soft">
          Active Plan
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xs sm:text-sm font-bold text-text-muted uppercase tracking-[0.2em] mb-1 truncate">{plan.type}</h3>
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-3xl sm:text-4xl font-black text-sage-deep">{plan.price}</span>
          <span className="text-text-muted font-medium text-[10px] sm:text-xs">/month</span>
        </div>
      </div>

      <ul className="space-y-4 mb-10">
        <FeatureItem label={`${plan.aiTokenLimit === -1 ? 'Unlimited' : (plan.aiTokenLimit || 0).toLocaleString('en-US')} AI Tokens`} />
        <FeatureItem label={`${plan.automationLimit === -1 ? 'Unlimited' : plan.automationLimit} Automations`} />
        <FeatureItem label={`${plan.memberLimit === -1 ? 'Unlimited' : plan.memberLimit} Seats`} />
        <FeatureItem label="Advanced Insight Engine" />
      </ul>

      <AccessGate role={role} action="billing_access" showBlur={false}>
        {showGPay && !isCurrent ? (
           <div className="w-full h-[56px] flex justify-center items-center">
            <GooglePayButton
              environment="TEST"
              paymentRequest={{
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                  {
                    type: "CARD",
                    parameters: {
                      allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                      allowedCardNetworks: ["MASTERCARD", "VISA"],
                    },
                    tokenizationSpecification: {
                      type: "PAYMENT_GATEWAY",
                      parameters: {
                        gateway: "example",
                        gatewayMerchantId: "exampleGatewayMerchantId",
                      },
                    },
                  },
                ],
                merchantInfo: {
                  merchantId: "12345678901234567890",
                  merchantName: "FlowBoard",
                },
                transactionInfo: {
                  totalPriceStatus: "FINAL",
                  totalPriceLabel: "Total",
                  totalPrice: plan.price.replace(/[^0-9.]/g, ''),
                  currencyCode: "USD",
                  countryCode: "US",
                },
              }}
              onLoadPaymentData={(paymentRequest) => {
                console.log("load payment data", paymentRequest);
                toast.success(`Payment successful for ${plan.type} plan!`);
                setShowGPay(false);
                // Trigger reload with success params to trigger mock UI update
                window.location.href = `/dashboard/billing?success=true&upgraded=${plan.type}`;
              }}
              buttonSizeMode="fill"
            />
          </div>
        ) : (
          <button 
            onClick={handleUpgradeClick}
            disabled={loading || isCurrent}
            className={cn(
              "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-[10px] uppercase tracking-[0.2em]",
              isCurrent 
                ? "bg-bg-alt text-text-muted cursor-default" 
                : "bg-sage-deep text-white hover:bg-black hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-soft"
            )}
          >
            {loading ? "Processing..." : isCurrent ? "Active" : "Transition to " + plan.type}
            {!isCurrent && !loading && <ArrowRight size={14} />}
          </button>
        )}
      </AccessGate>
    </div>
  );
};


const FeatureItem = ({ label }: { label: string }) => (
  <li className="flex items-start gap-3">
    <div className="mt-0.5 w-4.5 h-4.5 rounded-full bg-sage/10 flex items-center justify-center text-sage shrink-0">
      <Check size={10} strokeWidth={3} />
    </div>
    <span className="text-xs sm:text-sm font-medium text-text-secondary">{label}</span>
  </li>
);

const ComparisonRow = ({ label, values }: { label: string, values: any[] }) => (
  <tr className="hover:bg-surface-primary/20 transition-colors">
    <td className="p-5 text-sm font-bold text-sage-deep">{label}</td>
    {values.map((v, i) => (
      <td key={i} className="p-5 text-xs sm:text-sm text-text-secondary">
        {typeof v === 'boolean' ? (
          v ? <div className="w-5 h-5 rounded-full bg-sage/10 flex items-center justify-center text-sage"><Check size={12} strokeWidth={3} /></div> : "—"
        ) : v}
      </td>
    ))}
  </tr>
);
