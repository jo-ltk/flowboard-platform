"use client";

import React from "react";

export default function Statement() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden bg-surface-tinted">
      {/* Soft overlapping shapes */}
      <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-b from-cream to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-cream to-transparent pointer-events-none z-20" />

      {/* Decorative circles — smaller on mobile */}
      <div className="absolute top-[20%] right-[5%] sm:right-[15%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-soft-blue/8 blur-2xl sm:blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] sm:left-[10%] w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] rounded-full bg-light-green/10 blur-2xl sm:blur-3xl pointer-events-none" />

      {/* Pastel dots pattern — reduced opacity on mobile */}
      <div className="absolute inset-0 pastel-dots opacity-20 sm:opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-6 max-w-5xl">
        {/* Micro-label */}
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-soft-blue mb-6 sm:mb-8 bg-soft-blue/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
          Why FlowBoard
        </span>

        {/* Headline */}
        <div className="flex flex-col items-center">
          <h2 className="font-syne text-clamp-statement font-extrabold uppercase leading-[0.88] tracking-tight text-deep-blue">
            Work is broken.
          </h2>
          <h2 className="font-syne text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-deep-blue/30 mt-3 sm:mt-4">
            We rewrite the system.
          </h2>
        </div>

        {/* Divider & Supporting Text */}
        <div className="mt-12 sm:mt-20 w-full max-w-2xl flex flex-col items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-deep-blue/15 to-transparent mb-6 sm:mb-8 origin-center" />
          <p className="text-sm sm:text-base text-deep-blue/50 leading-relaxed max-w-lg tracking-wide px-2">
            Traditional tooling creates friction. FlowBoard removes it. 
            A thoughtful approach to productivity — designed for teams that value clarity. 
            No noise. Just flow.
          </p>
        </div>
      </div>
    </section>
  );
}
