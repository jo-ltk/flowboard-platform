"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Layout, Zap, Search } from "lucide-react";
import ParticleBackground from "@/components/ui/AntigravityBackground";

export default function Hero() {
  return (
    <section className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden bg-cream pt-10 sm:pt-16">
      {/* ─── Interactive Background ─── */}
      <ParticleBackground />
      
      {/* ─── Static Background Orchestration ─── */}
      <div className="absolute inset-0 gradient-hero-glow opacity-40 pointer-events-none" />
      <div className="absolute inset-0 editorial-grid opacity-[0.03] pointer-events-none hidden sm:block" />
      
      {/* Subtle Grain for Depth */}
      <div className="absolute inset-0 grain-overlay opacity-[0.008] pointer-events-none hidden sm:block" />

      {/* ─── Content Layer ─── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-10 flex flex-col items-center text-center">
        {/* AI Tag - Compact & Centered */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-soft-blue/20 bg-white/40 backdrop-blur-md mb-6 sm:mb-8 scale-90">
          <Sparkles className="w-3 h-3 text-deep-blue" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-deep-blue font-bold">
            Intelligence Optimized v2.4
          </span>
        </div>

        {/* Primary Headline - Centered */}
        <div className="flex flex-col gap-2 mb-6 sm:mb-8">
          <h1 className="font-syne text-[clamp(2rem,6vw,4.5rem)] font-extrabold uppercase leading-[1.05] tracking-tight text-deep-blue">
            Design the <br />
            <span className="text-soft-blue">Future</span>.
          </h1>
          <p className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-deep-blue/40">
            Flow with clarity.
          </p>
        </div>

        {/* CTA Actions - Centered, Reduced Size, Narrower Container */}
        <div className="flex flex-col items-center gap-3 w-full max-w-[320px] sm:max-w-none sm:flex-row sm:justify-center mb-16 sm:mb-20">
          <Link href="/dashboard" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-deep-blue text-cream rounded-full font-bold text-xs uppercase tracking-widest shadow-md hover:bg-deep-blue/90 transition-all duration-300 no-underline">
            <span className="relative z-10 flex items-center gap-2">
              Start Building <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          
          <button
            onClick={() => {
              const el = document.getElementById("about");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-3.5 bg-white/60 backdrop-blur-md text-deep-blue/80 rounded-full font-bold text-xs uppercase tracking-widest border border-border-soft hover:bg-cream-warm transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            Case Studies
          </button>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("open-chatbot"))}
            className="w-full sm:w-auto px-6 py-3 bg-transparent text-deep-blue border border-soft-blue/30 hover:bg-soft-blue/5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Ask AI
          </button>
        </div>

        {/* ─── Compact Architectural Highlights ─── */}
        <div className="w-full border-t border-border-soft pt-10 sm:pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
          <HighlightItem 
            icon={<Zap className="w-4 h-4 text-soft-blue" />}
            title="Neural Velocity" 
            desc="AI that synchronizes your entire architecture."
          />
          <HighlightItem 
            icon={<Search className="w-4 h-4 text-deep-blue-light" />}
            title="Deep Clarity" 
            desc="Remove noise with semantic organization."
          />
          <HighlightItem 
            icon={<Layout className="w-4 h-4 text-deep-blue/40" />}
            title="Architectural UX" 
            desc="Designed for strategic minds valuing calm."
          />
        </div>
      </div>
    </section>
  );
}

function HighlightItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center mb-1 group-hover:scale-105 transition-transform duration-500 border border-border-soft">
        {icon}
      </div>
      <h3 className="font-syne font-bold text-xs sm:text-sm text-deep-blue tracking-tight uppercase">{title}</h3>
      <p className="text-deep-blue/40 text-[11px] leading-relaxed max-w-[200px]">
        {desc}
      </p>
    </div>
  );
}
