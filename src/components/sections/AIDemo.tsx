"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Layers, Fingerprint } from "lucide-react";
import { Container } from "@/components/ui/Container";

const FEATURES = [
  {
    icon: <Cpu className="w-5 h-5" />,
    label: "Neural Engine",
    desc: "Proprietary LLM orchestration for project logic."
  },
  {
    icon: <Layers className="w-5 h-5" />,
    label: "Adaptive Flow",
    desc: "Predictive adjustment based on team velocity."
  },
  {
    icon: <Fingerprint className="w-5 h-5" />,
    label: "Secure Protocol",
    desc: "Air-gapped data isolation by default."
  }
];

export default function AIDemo() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section 
      ref={containerRef}
      id="ai-demo" 
      className="relative min-h-[120vh] w-full bg-[#1A1F1D] overflow-hidden flex items-center py-32"
    >
      {/* Technical Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(#white 1px, transparent 1px), linear-gradient(90deg, #white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Floating Architectural Background Elements */}
      <motion.div style={{ y: y1 }} className="absolute -top-20 -right-40 w-[600px] h-[600px] border border-white/5 rounded-none rotate-45 pointer-events-none" />
      <motion.div style={{ y: y2 }} className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-[#8CBA41]/5 blur-[120px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Content Block */}
          <div className="lg:col-span-6 space-y-12">
            <div>
              <span className="text-[11px] font-bold text-[#8CBA41] uppercase tracking-[0.4em] mb-6 block">
                INTELLIGENCE PROTOCOL V.04
              </span>
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white leading-[1] tracking-tighter mb-10">
                Teams that <br />
                found <br />
                <span className="text-[#8CBA41] italic">clarity & comfort.</span>
              </h2>
              <div className="w-32 h-px bg-[#8CBA41]/30" />
            </div>

            <div className="space-y-8">
              <p className="text-3xl md:text-4xl text-white/90 leading-tight italic font-medium tracking-tight">
                &ldquo;Flow isn&apos;t just speed; it&apos;s the elimination of noise so the blueprint of your success can emerge.&rdquo;
              </p>
              <p className="text-[#AFC8B8] text-lg font-light leading-relaxed max-w-lg">
                We didn't build a chatbot. We built a project nervous system that anticipates bottlenecks before they crystallize into delays.
              </p>
            </div>

            <div className="pt-8">
              <button className="group flex items-center gap-6 px-10 py-5 bg-white text-[#1A1F1D] rounded-none font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#8CBA41] transition-all duration-500">
                Initialize Engine
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </button>
            </div>
          </div>

          {/* Right: Technical Visualizer */}
          <div className="lg:col-span-6 relative h-[600px] flex items-center justify-center">
            {/* Main Display Card */}
            <motion.div 
              style={{ y: y1 }}
              className="relative z-20 w-full max-w-[480px] aspect-square bg-[#2F3A35] border border-white/10 p-1 shadow-2xl"
            >
              <div className="w-full h-full border border-white/5 relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                  alt="Protocol Visualization" 
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-1000"
                />
                {/* HUD Elements */}
                <div className="absolute top-8 left-8 p-4 bg-black/40 backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#8CBA41] animate-pulse" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">Live Pulse</span>
                  </div>
                  <div className="text-xl font-bold text-white tracking-tighter">98.4% Efficiency</div>
                </div>

                <div className="absolute bottom-0 right-0 p-8 border-t border-l border-white/10 bg-[#2F3A35]/80 backdrop-blur-xl">
                  <span className="text-[10px] font-bold text-[#8CBA41] uppercase tracking-[0.2em]">Ready For Deployment</span>
                </div>
              </div>
            </motion.div>

            {/* Feature Floating Stack */}
            <div className="absolute -right-8 bottom-0 z-30 space-y-4 hidden sm:block">
              {FEATURES.map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="bg-white p-6 border border-[#DDE5E1] shadow-xl w-[260px] group hover:bg-[#2F3A35] transition-all duration-500"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-[#8CBA41] group-hover:text-white transition-colors">{feat.icon}</div>
                    <span className="text-[10px] font-bold text-[#2F3A35] group-hover:text-white uppercase tracking-widest transition-colors">{feat.label}</span>
                  </div>
                  <p className="text-[11px] text-[#8A9E96] group-hover:text-white/60 leading-relaxed transition-colors">{feat.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Background Aesthetic Lines */}
            <div className="absolute inset-0 z-0 border-20 border-white/5 m-12 pointer-events-none" />
          </div>

        </div>
      </Container>
    </section>
  );
}

