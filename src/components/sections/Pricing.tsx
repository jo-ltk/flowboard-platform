"use client";

import React, { useState, useRef } from "react";
import { Check, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "For individuals exploring the boundaries of flow.",
    features: ["5 Workspaces", "10 Projects", "Core AI Analysis", "Community Support"],
    cta: "Begin Journey",
    recommended: false,
  },
  {
    name: "Architect",
    price: { monthly: 24, yearly: 19 },
    description: "Professional tools for power builders of the future.",
    features: [
      "Infinite Workspaces",
      "Advanced AI Orchestration",
      "Custom Editorial Themes",
      "Priority API Access",
      "1:1 Strategy Calls",
    ],
    cta: "Expand Scope",
    recommended: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 89, yearly: 69 },
    description: "Custom solutions for global-scale operations.",
    features: [
      "Custom Governance",
      "SAML/SSO Integration",
      "Air-gapped AI Models",
      "Dedicated Success Lead",
      "Unlimited Everything",
    ],
    cta: "Contact Design",
    recommended: false,
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToCard = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.firstElementChild?.clientWidth ?? 300;
    const gap = 16;
    const scrollAmount = direction === "left" ? -(cardWidth + gap) : (cardWidth + gap);
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="relative py-16 sm:py-24 md:py-32 px-5 sm:px-6 md:px-12 lg:px-20 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-10 sm:mb-16 md:mb-20">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-deep-blue/40">
          Investment Structures
        </span>
        <h2 className="mt-3 sm:mt-4 font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-deep-blue">
          Fair pricing for <br className="hidden sm:block" />infinite growth.
        </h2>

        {/* Billing Toggle */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <div className="relative p-1 bg-surface-sunken rounded-full flex items-center border border-border-soft">
            <div
              className="absolute h-[calc(100%-8px)] rounded-full bg-cream shadow-sm border border-border-soft transition-all duration-300"
              style={{
                width: "calc(50% - 4px)",
                left: billingCycle === "monthly" ? "4px" : "calc(50%)",
              }}
            />
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`relative z-10 px-5 sm:px-8 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-colors min-h-[44px] ${
                billingCycle === "monthly" ? "text-deep-blue" : "text-deep-blue/40"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`relative z-10 px-5 sm:px-8 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-colors min-h-[44px] ${
                billingCycle === "yearly" ? "text-deep-blue" : "text-deep-blue/40"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: horizontal scroll carousel | Desktop: grid */}
      {/* Scroll indicators (mobile only) */}
      <div className="flex items-center justify-center gap-4 mb-4 md:hidden">
        <button 
          onClick={() => scrollToCard("left")}
          className="w-10 h-10 rounded-full border border-border-soft bg-surface-elevated flex items-center justify-center text-deep-blue/40 hover:text-deep-blue transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-deep-blue/30">Swipe to explore</span>
        <button 
          onClick={() => scrollToCard("right")}
          className="w-10 h-10 rounded-full border border-border-soft bg-surface-elevated flex items-center justify-center text-deep-blue/40 hover:text-deep-blue transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Mobile: Scrollable | Desktop: Grid */}
        <div 
          ref={scrollContainerRef}
          className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 items-stretch overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 -mx-2 px-2 md:mx-0 md:px-0 scrollbar-hide"
        >
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-7 sm:p-10 rounded-[var(--radius-lg)] border bg-surface-elevated transition-all duration-300 hover:shadow-md snap-center shrink-0 w-[85vw] sm:w-[75vw] md:w-auto ${
                plan.recommended 
                  ? "border-light-green border-2 shadow-glow-blue z-10" 
                  : "border-soft-blue/30 shadow-sm"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-light-green px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-light-green-dark shadow-sm">
                  <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-deep-blue whitespace-nowrap">
                    Most Architectural
                  </span>
                </div>
              )}

              <div className="mb-6 sm:mb-8">
                <h3 className="font-syne text-xl sm:text-2xl font-bold text-deep-blue">{plan.name}</h3>
                <p className="mt-2 text-xs text-deep-blue/50 leading-relaxed min-h-10 sm:h-10">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8 sm:mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="font-syne text-4xl sm:text-5xl font-bold text-deep-blue transition-all duration-500">
                    ${billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase text-deep-blue/40">
                    / user / month
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <div className="mt-2 font-mono text-[10px] text-light-green-dark uppercase tracking-wider font-bold">
                    Billed annually (Save ~20%)
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <div className="w-full h-px bg-border-soft mb-6 sm:mb-8" />
                <ul className="space-y-3 sm:space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.recommended ? "bg-light-green/40" : "bg-soft-blue/20"}`}>
                        <Check className="w-2.5 h-2.5 text-deep-blue" />
                      </div>
                      <span className="font-mono text-[11px] text-deep-blue/70">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 sm:mt-12">
                <button className={`group relative w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-[var(--radius-md)] font-semibold uppercase tracking-wide text-[10px] transition-all duration-300 min-h-[48px] ${
                  plan.recommended 
                    ? "bg-deep-blue text-cream hover:bg-deep-blue-dark shadow-sm" 
                    : "bg-soft-blue/10 text-deep-blue hover:bg-soft-blue/20"
                }`}>
                  {plan.cta}
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-[20%] left-[5%] w-40 sm:w-64 h-40 sm:h-64 bg-light-green/5 blur-[30px] sm:blur-[50px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[5%] w-48 sm:w-80 h-48 sm:h-80 bg-soft-blue/5 blur-[30px] sm:blur-[50px] pointer-events-none -z-10" />
    </section>
  );
}
