"use client";

import React from "react";
import { Cpu, CheckCircle2, Leaf, Sparkles, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const AIDemo = () => {
  return (
    <section id="ai-demo" className="relative h-screen w-full bg-white overflow-hidden flex items-center justify-center font-[Poppins]">
      <div className="absolute inset-0 z-0 flex flex-col md:flex-row">
        {/* Left Visual Half */}
        <div className="relative w-full md:w-1/2 h-full bg-[#2F3A35] overflow-hidden">
          <img 
            src="https://picsum.photos/id/160/1200/1600" 
            alt="Natural Intelligence" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-12 left-12 md:bottom-20 md:left-20 max-w-md">
            <span className="text-[12px] font-bold text-[#8CBA41] uppercase tracking-[0.3em] mb-6 block">
              Cognitive Architecture
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[1] tracking-tighter text-white mb-8">
              Intelligence <br />
              that feels <br />
              <span className="text-[#8CBA41]">human.</span>
            </h2>
            <div className="w-20 h-1 bg-[#8CBA41]" />
          </div>
        </div>

        {/* Right Info Half */}
        <div className="relative w-full md:w-1/2 h-full bg-[#f8faf9] p-8 md:p-20 flex flex-col justify-center border-l border-[#DDE5E1]">
          <div className="max-w-xl space-y-12">
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl text-[#2F3A35] font-light leading-snug">
                &ldquo;Flow isn&apos;t just about speed; it&apos;s about removing the noise so clarity can emerge.&rdquo;
              </p>
              <p className="text-[#5C6B64] text-lg font-light leading-relaxed">
                Traditional AI feels clinical. We built FlowBoard to anticipate your needs with a gentle touch, organizing your project rhythm without the friction of automation.
              </p>
            </div>

            {/* Sharp Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Orchestration", desc: "Adaptive timelines that breathe." },
                { label: "Predictive Flow", desc: "Anticipating bottlenecks early." }
              ].map((item, i) => (
                <div key={i} className="bg-white border border-[#DDE5E1] p-6 rounded-none">
                  <h4 className="font-bold text-[#2F3A35] mb-2 uppercase tracking-widest text-xs">{item.label}</h4>
                  <p className="text-sm text-[#8A9E96] font-light">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button className="px-12 py-4 bg-[#2F3A35] text-white font-bold rounded-none text-[12px] tracking-[0.2em] uppercase hover:bg-black transition-all">
                Experience the Flow
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDemo;
