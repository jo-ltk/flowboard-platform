'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingIntroProps {
  onStart: () => void;
}

export const OnboardingIntro: React.FC<OnboardingIntroProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream grain-overlay overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-soft-blue/5 blur-[120px] rounded-full animate-pastel-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-light-green/5 blur-[120px] rounded-full animate-pastel-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 max-w-4xl px-6 text-center"
      >
        <span className="inline-block px-4 py-1.5 mb-8 text-[10px] sm:text-[12px] font-mono tracking-widest uppercase text-sage-deep/60 border border-sage-deep/10 rounded-full bg-surface-elevated/50 backdrop-blur-sm">
          Welcome to FlowBoard
        </span>

        <h1 className="font-syne text-[52px] sm:text-[72px] md:text-[84px] leading-[0.9] text-sage-deep font-bold tracking-tight mb-8">
          Let’s Architect <br />
          <span className="text-soft-blue">Your Workflow.</span>
        </h1>

        <div className="flex flex-col items-center">
          <div className="w-16 h-1 bg-light-green rounded-full mb-8" />
          
          <p className="font-mono text-[13px] sm:text-[14px] leading-relaxed text-sage-deep/70 max-w-lg mb-12">
            A premium space designed for focused execution and architectural clarity. Let's set up your environment in four curated steps.
          </p>

          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-syne font-bold text-sage-deep overflow-hidden rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-soft-blue-light transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-soft-blue-light to-light-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 text-[18px]">Begin Setup</span>
          </button>
        </div>
      </motion.div>

      {/* Decorative details */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] text-sage-deep/30 uppercase">
        EST. 2026 — FLOWBOARD SYSTEM
      </div>
    </div>
  );
};
