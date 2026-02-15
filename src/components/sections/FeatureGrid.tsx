"use client";

import React from "react";
import { Cpu, BarChart3, Users } from "lucide-react";

const features = [
  {
    id: "01",
    title: "AI Scheduler",
    description: "Intelligently orchestrate timelines. Predictive scheduling that adapts to your team's velocity in real-time.",
    icon: <Cpu className="w-5 h-5" />,
    className: "md:col-span-7",
    tint: "bg-soft-blue/6",
    accentColor: "text-soft-blue",
    iconBg: "bg-soft-blue/10 border-soft-blue/20",
  },
  {
    id: "02",
    title: "Report Engine",
    description: "Deep analytics, beautifully presented. Transform complex metrics into clear insights with one click.",
    icon: <BarChart3 className="w-5 h-5" />,
    className: "md:col-span-5",
    tint: "bg-light-green/8",
    accentColor: "text-deep-blue",
    iconBg: "bg-light-green/15 border-light-green-dark/20",
  },
  {
    id: "03",
    title: "Client Portal",
    description: "Secure, refined experience for stakeholders. Transparent progress tracking with zero friction.",
    icon: <Users className="w-5 h-5" />,
    className: "md:col-span-12",
    tint: "bg-deep-blue/4",
    accentColor: "text-deep-blue",
    iconBg: "bg-deep-blue/8 border-deep-blue/15",
  },
];

export default function FeatureGrid() {
  return (
    <section className="relative w-full bg-cream py-16 sm:py-24 md:py-32 px-5 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Soft editorial grid background — hidden on mobile for performance */}
      <div className="absolute inset-0 editorial-grid pointer-events-none opacity-60 hidden sm:block" />

      {/* Decorative gradient orbs — scaled down on mobile */}
      <div className="absolute top-[10%] right-[5%] w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-soft-blue/6 blur-2xl sm:blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[180px] sm:w-[350px] h-[180px] sm:h-[350px] rounded-full bg-light-green/8 blur-2xl sm:blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col mb-10 sm:mb-16 md:mb-20">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-soft-blue mb-3 sm:mb-4 bg-soft-blue/8 px-3 py-1.5 rounded-full inline-flex w-fit">
            Capabilities
          </span>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tight text-deep-blue">
            The New Standard.
          </h2>
        </div>

        {/* Mobile: vertical editorial cards | Desktop: asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group relative overflow-hidden rounded-[var(--radius-lg)] p-7 sm:p-10 md:p-12 border border-border-soft bg-surface-elevated transition-all duration-500 hover:shadow-[var(--shadow-medium)] hover:border-border-blue sm:hover:-translate-y-1 ${feature.className}`}
            >
              {/* Hover tint */}
              <div className={`absolute inset-0 ${feature.tint} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[var(--radius-lg)]`} />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6 sm:mb-10">
                  <span className="font-syne text-3xl sm:text-5xl font-black text-deep-blue/5 group-hover:text-soft-blue/15 transition-colors duration-500">
                    {feature.id}
                  </span>
                  <div className={`p-2.5 sm:p-3 rounded-[var(--radius-md)] border ${feature.iconBg} transition-colors ${feature.accentColor}`}>
                    {feature.icon}
                  </div>
                </div>

                <h3 className="font-syne text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-deep-blue mb-3 sm:mb-4 group-hover:text-deep-blue-dark transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-deep-blue/45 leading-relaxed max-w-md mb-6 sm:mb-10">
                  {feature.description}
                </p>

                <div className="mt-auto flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.15em] text-deep-blue/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-light-green" />
                  Available
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
