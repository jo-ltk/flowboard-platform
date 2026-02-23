"use client";

import React from "react";

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
      className="relative w-full bg-white py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden font-[Poppins]"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="flex flex-col mb-20 max-w-2xl">
          <span className="text-sm font-bold text-[#8A9E96] uppercase tracking-[0.2em] mb-4">
            Stories
          </span>
          <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-medium text-[#2F3A35] leading-[1.1] tracking-tight">
            Teams that found <br />
            <span className="text-[#8CBA41]">clarity & comfort.</span>
          </h2>
        </div>

        {/* Testimonial cards — Architectural layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#DDE5E1] border border-[#DDE5E1]">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white p-10 sm:p-14 lg:p-16 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-1 bg-[#8CBA41] mb-10" />
                <blockquote className="text-xl sm:text-2xl text-[#2F3A35] leading-relaxed font-light mb-12 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              {/* Attribution */}
              <div className="flex items-center gap-5 pt-8 border-t border-[#F4F7F5]">
                <div
                  className="w-12 h-12 rounded-none flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-[#2F3A35] text-[13px] uppercase tracking-widest leading-none">
                    {t.name}
                  </p>
                  <p className="text-[#8A9E96] text-[11px] mt-1.5 font-medium uppercase tracking-wider">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand logo strip */}
        <div className="mt-24">
          <p className="text-left text-[11px] font-bold uppercase tracking-[0.25em] text-[#8A9E96] mb-12">
            Trusted Partners
          </p>
          <div className="flex items-center justify-between flex-wrap gap-x-12 gap-y-8">
            {BRAND_LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-2xl sm:text-3xl font-bold text-[#2F3A35]/20 hover:text-[#2F3A35] transition-colors duration-500 cursor-default tracking-tighter uppercase"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
