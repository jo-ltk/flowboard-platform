"use client";

import React, { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "For individuals exploring calm, structured flow.",
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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20 max-w-7xl">
          <div className="max-w-2xl">
            <span className="text-sm font-bold text-[#8A9E96] uppercase tracking-[0.2em] mb-4 block">
              Pricing
            </span>
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-medium text-[#2F3A35] leading-[1.1] tracking-tight mb-6">
              Clear pricing, <br />
              <span className="text-[#8CBA41]">no surprises.</span>
            </h2>
            <p className="text-[#5C6B64] text-lg font-light leading-relaxed">
              Start free. Scale when you're ready. Every plan includes the calm, focused experience FlowBoard is known for.
            </p>
          </div>

          {/* Sharp Billing Toggle */}
          <div className="flex items-center border border-[#DDE5E1] bg-white p-1 rounded-none h-14 w-fit shrink-0">
            {(["monthly", "yearly"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setBilling(c)}
                className={`px-8 h-full flex items-center text-[11px] font-bold uppercase tracking-widest transition-all ${
                  billing === c ? "bg-[#2F3A35] text-white" : "text-[#8A9E96] hover:text-[#2F3A35]"
                }`}
              >
                {c}
                {c === "yearly" && (
                  <span className="ml-2 text-[10px] text-[#8CBA41]">—20%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Architectural Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#DDE5E1] border border-[#DDE5E1]">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white p-10 sm:p-14 flex flex-col justify-between relative ${
                plan.recommended ? "z-10" : "z-0"
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-[#8CBA41] text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                  Popular
                </div>
              )}

              <div>
                <div className="mb-12">
                  <h3 className="text-[13px] font-bold uppercase tracking-[0.25em] text-[#8A9E96] mb-8">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl md:text-6xl font-medium tracking-tighter text-[#2F3A35]">
                      ${billing === "monthly" ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#8A9E96]">
                      / mo
                    </span>
                  </div>
                  <p className="text-[#5C6B64] text-[15px] font-light leading-relaxed h-12">
                    {plan.description}
                  </p>
                </div>

                <div className="w-10 h-px bg-[#DDE5E1] mb-10" />

                <ul className="space-y-4 mb-12">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-4">
                      <Check className="w-4 h-4 text-[#8CBA41] shrink-0 mt-0.5" />
                      <span className="text-sm text-[#5C6B64] font-light leading-relaxed">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-5 font-bold text-[11px] uppercase tracking-[0.2em] transition-all border ${
                  plan.recommended
                    ? "bg-[#2F3A35] text-white border-[#2F3A35] hover:bg-black"
                    : "bg-transparent text-[#2F3A35] border-[#DDE5E1] hover:bg-[#F4F7F5]"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-between items-center text-[#8A9E96]">
          <p className="text-[11px] font-medium uppercase tracking-widest">
            No credit card required to start.
          </p>
          <div className="w-24 h-px bg-[#DDE5E1]" />
        </div>
      </div>
    </section>
  );
}
