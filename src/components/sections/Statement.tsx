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
      title: "Intelligent Scheduling",
      description: "FlowBoard removes friction with AI that adapts to your team's unique rhythm.",
      image: "https://picsum.photos/id/180/1000/1250",
    },
    {
      title: "Calm by Design",
      description: "Traditional tools create noise. We built FlowBoard for focus and clarity.",
      image: "https://picsum.photos/id/201/1000/1250",
    },
    {
      title: "Team-Centric AI",
      description: "AI that works with your team — not against it, driving order from chaos.",
      image: "https://picsum.photos/id/20/1000/1250",
    },
  ];

  return (
    <section
      id="why-flowboard"
      className="relative w-full bg-white py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden font-[Poppins]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-baseline justify-between gap-8 mb-20">
          <div className="max-w-3xl">
            <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-medium text-[#2F3A35] leading-[1.05] tracking-tight mb-8">
              Work is chaotic. <br />
              <span className="text-[#8CBA41]">FlowBoard brings order.</span>
            </h2>
            <p className="text-[#5C6B64] text-lg sm:text-xl leading-relaxed max-w-2xl font-light">
              Traditional project tools create noise. FlowBoard removes friction with 
              intelligent scheduling, calm design, and AI that works with your team.
            </p>
          </div>
          <div className="lg:max-w-xs">
            <p className="text-sm text-[#8A9E96] leading-relaxed uppercase tracking-wider font-semibold">
              Designed for clarity
            </p>
            <div className="w-12 h-1 bg-[#8CBA41] mt-3" />
          </div>
        </div>

        {/* 3-Column Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative aspect-4/5 rounded-none overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#DDE5E1]/30"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Gradient Overlay - slightly more neutral for a premium feel */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity duration-500" />
              
              {/* Content Overlay - Always Visible */}
              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end items-start text-left">
                <div className="w-full">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-white drop-shadow-lg">
                    {card.title}
                  </h3>
                  <div className="w-12 h-0.5 bg-[#8CBA41] mb-4" />
                  <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light max-w-xs">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Metrics (Subtle Integration) */}
        <div className="mt-24 pt-12 border-t border-[#DDE5E1] grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
          {METRICS.map((m, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-4xl lg:text-5xl font-bold text-[#2F3A35] mb-2 tracking-tighter">
                {m.value}
              </span>
              <span className="text-sm font-bold text-[#2F3A35] uppercase tracking-wide">
                {m.label}
              </span>
              <span className="text-xs text-[#8A9E96] mt-1 font-medium italic">
                {m.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
