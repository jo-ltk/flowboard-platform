"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-dvh w-full flex overflow-hidden bg-cream">

      {/* ════════════════════════════════════════
          LEFT HALF — Text content
      ════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-14 xl:px-20 pt-28 pb-20 lg:pt-0 lg:pb-0">

        {/* Ambient glow behind text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-soft-blue/15 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-start gap-7 max-w-xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-soft-blue/10 border border-soft-blue/25 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-deep-blue" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.15em] text-deep-blue/80">
              Intelligence Optimized v2.4
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-syne text-[clamp(3.6rem,7vw,6.8rem)] font-extrabold leading-[1.02] tracking-tight text-deep-blue">
            Design<br />
            the{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Future.</span>
              <span className="absolute inset-x-0 bottom-1.5 h-[0.2em] bg-soft-blue/35 rounded-sm z-0" />
            </span>
          </h1>

          {/* Sub-text */}
          <p className="font-serif italic text-[1.35rem] sm:text-[1.6rem] text-deep-blue/50 leading-normal max-w-sm">
            Flow with clarity.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-deep-blue text-cream rounded-full font-bold text-xs uppercase tracking-widest shadow-medium hover:bg-deep-blue-dark hover:shadow-elevated hover:-translate-y-[2px] transition-all duration-300"
            >
              Start Building
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 bg-white/70 border border-border-soft text-deep-blue/80 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-cream-warm hover:border-border-blue hover:shadow-soft hover:-translate-y-[2px] transition-all duration-300 shadow-sm backdrop-blur-sm"
            >
              Case Studies
            </button>
          </div>

          {/* Social proof strip */}
          <div className="flex items-center gap-4 pt-3 border-t border-border-soft w-full">
            <div className="flex -space-x-2.5">
              {[
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&q=80",
                "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=48&q=80",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&q=80",
              ].map((src, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-cream overflow-hidden shadow-sm">
                  <Image src={src} alt="User" width={32} height={32} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-deep-blue/50 font-medium leading-snug">
              Trusted by <span className="text-deep-blue font-bold">2,400+</span> teams worldwide
            </p>
          </div>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT HALF — Full-bleed Hero Image
      ════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block relative w-1/2 h-dvh flex-shrink-0"
      >
        {/* Image */}
        <Image
          src="/hero-person.png"
          alt="Welcome to FlowBoard — Design the Future"
          fill
          priority
          className="object-cover object-center"
          sizes="50vw"
        />

        {/* Gradient overlay — bottom fade */}
        <div className="absolute inset-0 bg-linear-to-t from-deep-blue/30 via-transparent to-transparent pointer-events-none" />

        {/* Floating stat card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-10 left-8 bg-white/80 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-elevated border border-border-soft flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-deep-blue flex items-center justify-center shrink-0">
            <div className="w-4 h-4 bg-light-green rounded-sm" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-widest text-deep-blue/40 font-semibold">AI Velocity Score</span>
            <span className="text-xl font-extrabold text-deep-blue font-syne leading-none">92.4%</span>
          </div>
          <div className="ml-2 px-2.5 py-1 bg-light-green/50 border border-light-green-dark/30 rounded-full text-[10px] font-bold text-deep-blue/70">
            ↑ 12%
          </div>
        </motion.div>

        {/* Floating tag top-right */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-10 right-8 bg-white/80 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-elevated border border-border-soft"
        >
          <span className="text-[11px] font-bold text-deep-blue uppercase tracking-widest">🚀 Live · 24 Projects</span>
        </motion.div>
      </motion.div>

    </section>
  );
}
