"use client";

import React from "react";

const BRAND_LOGOS = [
  { name: "Lumina", id: "lumina" },
  { name: "Vertex", id: "vertex" },
  { name: "Aether", id: "aether" },
  { name: "Nexus", id: "nexus" },
  { name: "Vantage", id: "vantage" },
];

export default function SocialProof() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 px-5 sm:px-6 md:px-12 lg:px-20 bg-cream overflow-hidden">
      {/* Layered Pastel Shapes — smaller on mobile */}
      <div className="absolute top-0 right-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-soft-blue/5 rounded-full blur-2xl sm:blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-light-green/10 rounded-full blur-2xl sm:blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left Side: Massive Pull-quote */}
          <div className="lg:col-span-8 relative z-10">
            {/* Decorative soft blue block — hidden on mobile to avoid clutter */}
            <div 
              className="absolute -top-8 -left-4 sm:-top-12 sm:-left-12 w-32 sm:w-64 h-32 sm:h-64 bg-soft-blue/10 rounded-[var(--radius-xl)] -z-10 hidden sm:block"
            />
            
            <div>
              <h2 className="font-serif italic text-2xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.15] sm:leading-[1.1] text-deep-blue">
                &ldquo;FlowBoard didn&apos;t just organize our tasks; it changed the very velocity of how we think and build.&rdquo;
              </h2>
              
              <div className="mt-8 sm:mt-12 flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-deep-blue font-bold">
                  Alex Sterling
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-deep-blue/40">
                  Founder & CEO, Aether Systems
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Founder Image Placeholder Panel */}
          <div className="lg:col-span-4 relative group">
            <div
              className="relative aspect-[4/5] sm:aspect-4/5 w-full max-w-[320px] mx-auto lg:max-w-none bg-surface-sunken rounded-[var(--radius-lg)] overflow-hidden shadow-medium border border-border-soft"
            >
              {/* Image Placeholder with Soft Tint */}
              <div className="absolute inset-0 bg-gradient-to-tr from-soft-blue/20 to-transparent mix-blend-multiply opacity-60 pointer-events-none z-10" />
              
              {/* Placeholder text/pattern */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-mono text-[10px] uppercase tracking-widest text-deep-blue/10 rotate-90">EDITORIAL_M_042</span>
              </div>
              
              {/* Simple geometric shape for visual interest */}
              <div className="absolute bottom-8 right-8 sm:bottom-10 sm:right-10 w-20 sm:w-24 h-20 sm:h-24 border border-deep-blue/5 rounded-full" />
              
              <div className="w-full h-full bg-[#E5E2DA] flex items-center justify-center">
                 <div className="text-deep-blue/20 text-xs font-mono uppercase tracking-[0.2em]">Founder Portrait</div>
              </div>
            </div>
            
            {/* Accent shape overlapping image — smaller on mobile */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-16 sm:w-24 h-16 sm:h-24 bg-light-green rounded-[var(--radius-md)] -z-10 shadow-soft" />
          </div>
        </div>

        {/* Brand Logo Strip */}
        <div className="mt-16 sm:mt-24 md:mt-32 pt-10 sm:pt-16 border-t border-deep-blue/5">
          {/* Mobile: scrollable row | Desktop: flex-wrap */}
          <div className="flex items-center gap-8 sm:gap-12 md:gap-16 overflow-x-auto sm:overflow-visible sm:flex-wrap sm:justify-between pb-4 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0 opacity-50 grayscale sm:hover:grayscale-0 transition-all duration-500 scrollbar-hide">
            {BRAND_LOGOS.map((logo) => (
              <div
                key={logo.id}
                className="shrink-0 sm:shrink cursor-default"
              >
                <span className="font-syne text-lg sm:text-xl md:text-2xl font-bold text-deep-blue/60 tracking-tight whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
