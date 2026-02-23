"use client";

import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const PLANS = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "For individuals mastering their personal project flow.",
    features: ["5 Workspaces", "10 Projects", "Core AI Scheduling", "Community Support"],
    cta: "Get Started Free",
    recommended: false,
  },
  {
    name: "Architect",
    price: { monthly: 24, yearly: 19 },
    description: "Professional tools for teams who value clarity and speed.",
    features: [
      "Unlimited Workspaces",
      "Advanced AI Orchestration",
      "Custom Reports & Analytics",
      "Priority API Access",
      "1:1 Strategy Calls",
    ],
    cta: "Start Building",
    recommended: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 89, yearly: 69 },
    description: "Bespoke solutions for global-scale operations.",
    features: [
      "Custom Governance",
      "SAML/SSO Integration",
      "Air-gapped AI Models",
      "Dedicated Success Lead",
      "Unlimited Everything",
    ],
    cta: "Contact Us",
    recommended: false,
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section
      id="pricing"
      className="relative w-full bg-[#f8faf9] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden font-[Poppins]"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold text-[#8A9E96] uppercase tracking-[0.4em] mb-4 block">
              INVESTMENT PROTOCOL
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-[#2F3A35] leading-none tracking-tighter mb-8">
              Clear pricing, <br />
              <span className="text-[#8CBA41] italic">no surprises.</span>
            </h2>
            <p className="text-[#5C6B64] text-lg sm:text-xl font-light leading-relaxed max-w-xl">
              Start free. Scale when you&apos;re ready. Every plan includes the 
              streamlined, efficient project architecture FlowBoard is built upon.
            </p>
          </div>

          {/* Technical Billing Toggle */}
          <div className="flex items-center bg-[#DDE5E1]/30 p-1 border border-[#DDE5E1] shrink-0 h-16">
            {(["monthly", "yearly"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setBilling(c)}
                className={`relative px-10 h-full flex items-center text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 overflow-hidden ${
                  billing === c ? "text-white" : "text-[#8A9E96] hover:text-[#2F3A35]"
                }`}
              >
                {billing === c && (
                  <motion.div 
                    layoutId="billing-bg"
                    className="absolute inset-0 bg-[#2F3A35]"
                  />
                )}
                <span className="relative z-10">{c}</span>
                {c === "yearly" && (
                  <span className="relative z-10 ml-3 text-[#8CBA41]">—20%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Architectural Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#DDE5E1] border border-[#DDE5E1]">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group bg-white p-12 sm:p-14 lg:p-16 flex flex-col justify-between relative overflow-hidden transition-all duration-700 ${
                plan.recommended ? "hover:scale-[1.02] shadow-2xl z-10" : "hover:bg-[#F4F7F5]"
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-[#8CBA41] text-white px-6 py-1.5 text-[9px] font-black uppercase tracking-[0.3em]">
                  Recommended
                </div>
              )}

              <div>
                <div className="mb-16">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-8 h-px bg-[#8CBA41]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8CBA41]">
                      Tier 0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-[#2F3A35] mb-8">
                    {plan.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-6xl lg:text-7xl font-black tracking-tighter text-[#2F3A35]">
                      ${billing === "monthly" ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8A9E96]">
                      / mo
                    </span>
                  </div>
                  <p className="text-[#5C6B64] text-sm font-light leading-relaxed max-w-[240px]">
                    {plan.description}
                  </p>
                </div>

                <div className="w-full h-px bg-[#DDE5E1] mb-12 opacity-50" />

                <ul className="space-y-5 mb-16">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-4 group/item">
                      <div className="w-1.5 h-1.5 bg-[#8CBA41] rounded-none rotate-45" />
                      <span className="text-sm text-[#2F3A35] font-medium tracking-tight">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-6 font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-500 border rounded-none ${
                  plan.recommended
                    ? "bg-[#2F3A35] text-white border-[#2F3A35] hover:bg-[#8CBA41] hover:border-[#8CBA41]"
                    : "bg-transparent text-[#2F3A35] border-[#2F3A35] hover:bg-[#2F3A35] hover:text-white"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Technical Footer Accent */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8A9E96]">
              Secure Transaction Protocol
            </p>
            <div className="h-px w-24 bg-[#DDE5E1]" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A9E96] italic">
            No long-term commitments. Cancel architecture at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
