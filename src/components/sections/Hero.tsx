"use client";

import React from "react";
import { ArrowRight, Sparkles, Layout, Zap, Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden bg-cream pt-20 sm:pt-24">
      {/* ─── Background Orchestration ─── */}
      <div className="absolute inset-0 gradient-hero-glow opacity-60 pointer-events-none" />
      <div className="absolute inset-0 editorial-grid opacity-[0.04] pointer-events-none hidden sm:block" />
      
      {/* ─── Static Background Accents (scaled down on mobile) ─── */}
      <div 
        className="absolute top-[-10%] left-[-5%] w-[80%] sm:w-[60%] h-[40%] sm:h-[60%] bg-soft-blue/10 blur-[60px] sm:blur-[80px] opacity-40 rounded-full pointer-events-none" 
      />
      <div 
        className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[50%] sm:h-[70%] bg-light-green/15 blur-[60px] sm:blur-[100px] opacity-30 rounded-full pointer-events-none" 
      />
      
      {/* Subtle Grain for Depth — hidden on mobile for performance */}
      <div className="absolute inset-0 grain-overlay opacity-[0.02] pointer-events-none hidden sm:block" />

      {/* ─── Content Layer ─── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 flex flex-col items-center text-center">
        {/* AI Tag */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-soft-blue/30 bg-soft-blue/10 backdrop-blur-md mb-6 sm:mb-8">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-deep-blue" />
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-deep-blue font-bold">
            Intelligence Optimized v2.4
          </span>
        </div>

        {/* Primary Headline */}
        <div className="flex flex-col gap-1 sm:gap-2 mb-8 sm:mb-8">
          <h1 className="font-syne text-[clamp(2.5rem,10vw,9rem)] font-extrabold uppercase leading-[0.88] tracking-tight text-deep-blue">
            Design the <span className="text-soft-blue">Future</span>.
          </h1>
          <h2 className="font-serif italic text-2xl sm:text-4xl md:text-7xl lg:text-8xl text-deep-blue/30 -mt-1 sm:-mt-2">
            Flow with clarity.
          </h2>
        </div>

        {/* CTA Actions — Full-width stacked on mobile */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none sm:flex-row sm:justify-center mb-16 sm:mb-20">
          <button className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-deep-blue text-cream rounded-full font-bold text-sm uppercase tracking-widest shadow-md hover:bg-deep-blue/90 transition-all duration-300">
            <span className="relative z-10 flex items-center gap-2">
              Start Building <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          
          <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white/50 backdrop-blur-sm text-deep-blue/80 rounded-full font-bold text-sm uppercase tracking-widest border border-border-soft hover:bg-cream-warm transition-colors duration-300">
            View Case Studies
          </button>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent text-deep-blue border border-light-green hover:bg-light-green/20 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-soft-blue" />
            Or ask FlowBoard AI
          </button>
        </div>
      </div>

      {/* ─── Architectural Highlights ─── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 mt-16 sm:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 text-center pb-16 sm:pb-24 border-t border-border-soft pt-12 sm:pt-16">
        <HighlightItem 
          icon={<Zap className="w-5 h-5 text-soft-blue" />}
          title="Neural Velocity" 
          desc="AI that doesn't just suggest — it synchronizes your entire workflow architecture."
        />
        <HighlightItem 
          icon={<Search className="w-5 h-5 text-light-green-dark" />}
          title="Deep Clarity" 
          desc="Remove the noise of traditional project management with semantic organization."
        />
        <HighlightItem 
          icon={<Layout className="w-5 h-5 text-deep-blue/40" />}
          title="Architectural UX" 
          desc="Designed for strategic minds who value proportion, calm, and performance."
        />
      </div>
    </section>
  );
}

function HighlightItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 group">
      <div className="w-12 h-12 rounded-full bg-surface-sunken flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-105 transition-transform duration-500 border border-border-soft">
        {icon}
      </div>
      <h3 className="font-syne font-bold text-base sm:text-lg text-deep-blue tracking-tight uppercase">{title}</h3>
      <p className="text-deep-blue/50 text-sm leading-relaxed max-w-[280px]">
        {desc}
      </p>
    </div>
  );
}
