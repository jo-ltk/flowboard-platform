"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const features = [
  {
    title: "AI SCHEDULER",
    description: "Intelligently orchestrate timelines with predictive scheduling that adapts in real-time.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "REPORT ENGINE",
    description: "Deep analytics, beautifully presented. Transform complex metrics into clear insights.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
  },
  {
    title: "CLIENT PORTAL",
    description: "Secure, refined experience for stakeholders with zero friction tracking.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop",
  },
  {
    title: "ENTERPRISE PRIVACY",
    description: "SOC2 compliant. SAML/SSO ready. Your data stays yours — always private.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function FeatureGrid() {
  return (
    <section
      id="features"
      className="relative w-full bg-[#f8faf9] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden font-[Poppins]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col mb-20 max-w-2xl">
          <span className="text-[11px] font-bold text-[#8CBA41] uppercase tracking-[0.4em] mb-4">
            Capabilities
          </span>
          <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-black text-[#2F3A35] leading-none tracking-tighter">
            Everything your team <br />
            needs to <span className="text-[#8CBA41] italic">flow.</span>
          </h2>
        </div>

        {/* Simplified Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden mb-8 border border-[#DDE5E1]">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 border border-[#DDE5E1] opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-[#2F3A35]" />
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-[#8CBA41] uppercase tracking-widest">0{i + 1}</span>
                  <div className="h-px grow bg-[#DDE5E1]" />
                </div>
                <h3 className="text-xl font-bold text-[#2F3A35] tracking-tight group-hover:text-[#8CBA41] transition-colors uppercase">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#5C6B64] leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
