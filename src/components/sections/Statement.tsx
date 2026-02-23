"use client";

import React from "react";
import { motion } from "framer-motion";

const METRICS = [
  {
    value: "2,400+",
    label: "Teams using FlowBoard",
    sub: "across 60+ countries",
  },
  {
    value: "94.2%",
    label: "Average team velocity",
    sub: "measured by FlowScore™",
  },
  {
    value: "3×",
    label: "Faster project delivery",
    sub: "vs. traditional tooling",
  },
];

export default function Statement() {
  const cards = [
    {
      title: "INTELLIGENT SCHEDULING",
      description: "FlowBoard removes friction with AI that adapts to your team's unique rhythm and velocity.",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "BUILT FOR CLARITY",
      description: "Traditional tools create noise. We built FlowBoard to surface what matters, exactly when it matters.",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop",
    },
    {
      title: "TEAM-CENTRIC AI",
      description: "AI that works with your team — not against it, driving professional order from creative chaos.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  return (
    <section
      id="why-flowboard"
      className="relative w-full bg-white py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden font-[Poppins]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-baseline justify-between gap-8 mb-24">
          <div className="max-w-3xl">
            <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-black text-[#2F3A35] leading-none tracking-tighter mb-8">
              Work is chaotic. <br />
              <span className="text-[#8CBA41] italic">FlowBoard brings order.</span>
            </h2>
            <p className="text-[#5C6B64] text-lg sm:text-xl leading-relaxed max-w-2xl font-light">
              Traditional project tools create noise. FlowBoard removes friction with 
              intelligent scheduling, intuitive design, and AI that works for you.
            </p>
          </div>
          <div className="lg:max-w-xs flex flex-col items-end">
            <p className="text-[10px] text-[#8A9E96] leading-relaxed uppercase tracking-[0.4em] font-bold">
              Protocol v.04
            </p>
            <div className="w-12 h-px bg-[#8CBA41] mt-4" />
          </div>
        </div>

        {/* Simplified 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 overflow-hidden mb-8 border border-[#DDE5E1]">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-[#8CBA41] uppercase tracking-widest">Protocol 0{i + 1}</span>
                  <div className="h-px grow bg-[#DDE5E1]" />
                </div>
                <h3 className="text-xl font-black text-[#2F3A35] tracking-tighter group-hover:text-[#8CBA41] transition-colors uppercase">
                  {card.title}
                </h3>
                <p className="text-sm text-[#5C6B64] leading-relaxed font-light">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Metrics (Architectural Redesign) */}
        <div className="mt-32 pt-20 border-t border-[#DDE5E1]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#DDE5E1] border border-[#DDE5E1]">
            {METRICS.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white p-10 sm:p-14 group hover:bg-[#2F3A35] transition-all duration-500"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-px bg-[#8CBA41]" />
                    <span className="text-[10px] font-bold text-[#8A9E96] group-hover:text-white/40 uppercase tracking-[0.3em] transition-colors">
                      Metric 0{i + 1}
                    </span>
                  </div>

                  <span className="text-6xl lg:text-7xl font-bold text-[#2F3A35] group-hover:text-white mb-6 tracking-tighter transition-colors">
                    {m.value}
                  </span>

                  <div className="mt-auto">
                    <span className="text-[12px] font-black text-[#2F3A35] group-hover:text-[#8CBA41] uppercase tracking-[0.2em] block mb-2 transition-colors">
                      {m.label}
                    </span>
                    <span className="text-[11px] text-[#8A9E96] group-hover:text-white/40 font-medium italic tracking-wide transition-colors">
                      {m.sub}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
