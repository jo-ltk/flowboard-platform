"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Scheduler",
    description: "Intelligently orchestrate timelines with predictive scheduling that adapts in real-time.",
    image: "https://picsum.photos/id/1/1000/1250",
  },
  {
    title: "Report Engine",
    description: "Deep analytics, beautifully presented. Transform complex metrics into clear insights.",
    image: "https://picsum.photos/id/20/1000/1250",
  },
  {
    title: "Client Portal",
    description: "Secure, refined experience for stakeholders with zero friction tracking.",
    image: "https://picsum.photos/id/160/1000/1250",
  },
  {
    title: "Enterprise Security",
    description: "SOC2 compliant. SAML/SSO ready. Your data stays yours — always private.",
    image: "https://picsum.photos/id/2/1000/1250",
  },
];

export default function FeatureGrid() {
  return (
    <section
      id="features"
      className="relative w-full bg-[#F4F7F5] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden font-[Poppins]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col mb-16 max-w-2xl">
          <span className="text-sm font-bold text-[#8A9E96] uppercase tracking-[0.2em] mb-4">
            Capabilities
          </span>
          <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-medium text-[#2F3A35] leading-[1.1] tracking-tight">
            Everything your team needs to <br />
            <span className="text-[#8CBA41]">flow.</span>
          </h2>
          <p className="mt-6 text-[#5C6B64] text-lg font-light leading-relaxed">
            A thoughtful platform built for teams that value clarity over complexity.
          </p>
        </div>

        {/* Image Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative aspect-4/5 rounded-none overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#DDE5E1]/30"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity duration-500" />
              
              {/* Content Overlay - Always Visible */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="w-full">
                  <h3 className="text-lg font-bold mb-2 tracking-tight text-white drop-shadow-md">
                    {feature.title}
                  </h3>
                  <div className="w-8 h-0.5 bg-[#8CBA41] mb-3" />
                  <p className="text-[12px] text-white/90 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
