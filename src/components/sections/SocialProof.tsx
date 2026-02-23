"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "FlowBoard didn't just organize our projects — it changed the velocity of how we think and build together. Our delivery time dropped by 40% in the first month.",
    name: "Alex Sterling",
    role: "Founder & CEO",
    company: "Aether Systems",
    initials: "AS",
    color: "#7C9A8B",
  },
  {
    quote:
      "The calm, structured flow of this tool is unlike anything we've used before. It feels like it was designed for humans, not just for task lists.",
    name: "Maya Chen",
    role: "Head of Product",
    company: "Lumina Studio",
    initials: "MC",
    color: "#5F7D6E",
  },
];

const BRAND_LOGOS = ["Lumina", "Vertex", "Aether", "Nexus", "Vantage"];

export default function SocialProof() {
  return (
    <section
      id="about"
      className="relative w-full bg-[#f8faf9] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden font-[Poppins]"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold text-[#8A9E96] uppercase tracking-[0.4em] mb-4 block">
              SOCIAL VALIDATION
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-[#2F3A35] leading-none tracking-tighter">
              Teams that found <br />
              <span className="text-[#8CBA41] italic">clarity & comfort.</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-px w-12 bg-[#8CBA41]" />
            <p className="text-[10px] font-bold text-[#8A9E96] uppercase tracking-[0.3em]">
              CERTIFIED PARTNERS
            </p>
          </div>
        </div>

        {/* Testimonial grid — Architectural Monolith */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#DDE5E1] border border-[#DDE5E1]">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white p-12 sm:p-16 lg:p-20 group hover:bg-[#2F3A35] transition-all duration-700 cursor-default"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-12">
                  <span className="text-[10px] font-bold text-[#8CBA41] uppercase tracking-[0.3em]">
                    Log 0{i + 1}
                  </span>
                  <div className="h-px grow bg-[#DDE5E1]/50 group-hover:bg-white/10 transition-colors" />
                </div>

                <blockquote className="text-2xl sm:text-3xl lg:text-[2.2rem] text-[#2F3A35] group-hover:text-white leading-[1.2] tracking-tighter italic font-medium mb-16 transition-colors">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Attribution Structure */}
                <div className="mt-auto flex items-center gap-6">
                  <div 
                    className="w-16 h-16 flex items-center justify-center text-white text-[12px] font-black uppercase tracking-tighter shrink-0 border border-white/10 group-hover:bg-white group-hover:text-[#2F3A35] transition-all duration-500"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div className="relative">
                    <p className="font-black text-[#2F3A35] group-hover:text-white text-[14px] uppercase tracking-widest leading-none mb-2 transition-colors">
                      {t.name}
                    </p>
                    <p className="text-[#8A9E96] group-hover:text-[#8CBA41] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand logo strip — Animated Technical Marquee */}
        <div className="mt-32 pt-20 border-t border-[#DDE5E1]">
          <div className="flex items-center justify-between mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8A9E96]">
              STRATEGIC ALLIANCES
            </p>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-[#8CBA41]" />
              ))}
            </div>
          </div>
          
          <div className="relative flex overflow-x-hidden group">
            <motion.div 
              className="flex items-center gap-32 whitespace-nowrap min-w-full"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 40, 
                ease: "linear", 
                repeat: Infinity 
              }}
            >
              {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, idx) => (
                <span
                  key={`${logo}-${idx}`}
                  className="text-4xl font-black text-[#2F3A35]/10 group-hover:text-[#2F3A35]/30 hover:!text-[#8CBA41] transition-all duration-500 cursor-default tracking-[0.2em] uppercase"
                >
                  {logo}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
