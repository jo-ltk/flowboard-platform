"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, BarChart2, Users, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-dvh w-full flex overflow-hidden bg-cream">

      {/* ─── Ambient background glows ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-soft-blue/15 rounded-full blur-[150px] -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-light-green/20 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4" />
        <div className="editorial-grid absolute inset-0 opacity-[0.035]" />
      </div>

      {/* ════════════════════════════════════════
          LEFT — Text content
      ════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-14 xl:px-20 pt-28 pb-16 lg:pt-0 lg:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start gap-7 max-w-xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-soft-blue/10 border border-soft-blue/25">
            <Sparkles className="w-3.5 h-3.5 text-deep-blue" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.15em] text-deep-blue/80">
              Intelligence Optimized v2.4
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-syne text-[clamp(3.4rem,6.5vw,6.5rem)] font-extrabold leading-[1.02] tracking-tight text-deep-blue">
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
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-white/70 border border-border-soft text-deep-blue/80 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-cream-warm hover:border-border-blue hover:shadow-soft hover:-translate-y-[2px] transition-all duration-300 shadow-sm backdrop-blur-sm"
            >
              Case Studies
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex items-center gap-3 pt-2 border-t border-border-soft w-full">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-deep-blue" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <p className="text-[11px] text-deep-blue/50 font-medium">
              <span className="text-deep-blue font-bold">4.9/5</span> · Loved by 2,400+ teams
            </p>
          </div>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT — Abstract SaaS Visual
      ════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.1 }}
        className="hidden lg:flex relative w-1/2 h-dvh shrink-0 items-center justify-center overflow-hidden"
      >
        {/* Panel background */}
        <div className="absolute inset-0 bg-linear-to-br from-surface-tinted via-cream to-soft-blue-muted/40" />
        <div className="absolute inset-0 editorial-grid opacity-[0.05]" />

        {/* Large soft orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-soft-blue/10 blur-[80px]" />
        <div className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-light-green/20 blur-[60px]" />

        {/* ── Floating Card Grid ── */}
        <div className="relative z-10 flex flex-col gap-5 w-[380px]">

          {/* Card 1 — Main stat */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-elevated border border-border-soft"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-deep-blue/40 font-semibold">Velocity Score</span>
                <span className="text-4xl font-extrabold text-deep-blue font-syne leading-none">92.4%</span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1.5 bg-light-green/50 border border-light-green-dark/30 rounded-full text-[11px] font-bold text-deep-blue/70">↑ 12.1%</span>
                <div className="w-10 h-10 rounded-2xl bg-deep-blue/5 border border-border flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-deep-blue/60" />
                </div>
              </div>
            </div>
            {/* Mini bar chart */}
            <div className="flex items-end gap-1.5 h-14">
              {[38, 55, 44, 70, 60, 82, 68, 90, 76, 88, 80, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{
                  height: `${h}%`,
                  background: i >= 10 ? "#364c84" : `rgba(149,177,238,${0.2 + i * 0.04})`
                }} />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {["Jan","Apr","Jul","Oct","Dec"].map(m => (
                <span key={m} className="text-[9px] text-deep-blue/30 font-mono">{m}</span>
              ))}
            </div>
          </motion.div>

          {/* Row of 2 small cards */}
          <div className="flex gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 bg-deep-blue rounded-2xl p-5 flex flex-col gap-3 shadow-elevated"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-light-green" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-extrabold text-white font-syne leading-none">182</span>
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-medium">AI Tasks Done</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 bg-light-green/60 border border-light-green-dark/25 rounded-2xl p-5 flex flex-col gap-3 shadow-soft"
            >
              <div className="w-9 h-9 rounded-xl bg-white/50 flex items-center justify-center">
                <Users className="w-4 h-4 text-deep-blue" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-extrabold text-deep-blue font-syne leading-none">24</span>
                <span className="text-[10px] text-deep-blue/60 uppercase tracking-wider font-medium">Active Projects</span>
              </div>
            </motion.div>
          </div>

          {/* Card 3 — Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl px-5 py-4 border border-border-soft shadow-elevated flex flex-col gap-3"
          >
            <span className="text-[10px] uppercase tracking-widest text-deep-blue/40 font-semibold">Recent Flow</span>
            {[
              { name: "Design Sprint", status: "Completed", color: "bg-light-green-dark" },
              { name: "API Integration", status: "In Progress", color: "bg-soft-blue" },
              { name: "AI Report Gen", status: "Queued",      color: "bg-soft-blue-muted" },
            ].map(({ name, status, color }) => (
              <div key={name} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                <span className="flex-1 text-xs font-semibold text-deep-blue">{name}</span>
                <span className="text-[10px] text-deep-blue/40">{status}</span>
                {status === "Completed" && <CheckCircle2 className="w-3.5 h-3.5 text-light-green-dark shrink-0" />}
              </div>
            ))}
          </motion.div>

        </div>

        {/* Decorative ring top-right */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-[1.5px] border-soft-blue/20 opacity-60" />
        <div className="absolute top-16 right-16 w-20 h-20 rounded-full border-[1.5px] border-soft-blue/15 opacity-60" />

        {/* Decorative ring bottom-left */}
        <div className="absolute bottom-16 left-8 w-24 h-24 rounded-full border-[1.5px] border-light-green-dark/20 opacity-50" />

      </motion.div>

    </section>
  );
}
