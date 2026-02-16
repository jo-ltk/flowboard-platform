
import React, { Suspense } from 'react';
import { BillingPanel } from '@/components/system/BillingPanel';
import { getActiveWorkspace } from '@/lib/workspace-engine';
import { CreditCard, ShieldCheck, Zap, Loader2 } from 'lucide-react';

export default function BillingPage() {
  const activeWs = getActiveWorkspace();

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-stone-200/60">
        <div>
          <div className="flex items-center gap-2 text-stone-500 font-bold text-[11px] uppercase tracking-widest mb-3">
            <CreditCard size={12} />
            <span>Workspace Economics</span>
          </div>
          <h1 className="text-5xl font-black text-stone-900 leading-none">
            Billing & Plans
          </h1>
        </div>
        <div className="flex items-center gap-4 text-stone-500 text-sm font-medium italic">
          <div className="flex items-center gap-1.5 border-r border-stone-200 pr-4">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={16} className="text-blue-500" />
            <span>Instant Scaling</span>
          </div>
        </div>
      </header>

      <Suspense fallback={
        <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-stone-200/60">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">Loading Billing Context...</p>
        </div>
      }>
        <BillingPanel workspace={activeWs} />
      </Suspense>
    </div>
  );
}
