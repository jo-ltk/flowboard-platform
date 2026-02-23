"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  },
  item: {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
  },
};

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black font-[Poppins]">
      {/* ─── Background Image ─── */}
      <div className="absolute inset-0 z-0 bg-[#2F3A35]">
        <img
          src="https://picsum.photos/id/1018/1920/1080"
          alt="Meditation — FlowBoard"
          className="w-full h-full object-cover opacity-90"
          loading="eager"
        />
        {/* Soft shadow/gradient for text readability */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-end px-6 sm:px-14 lg:px-20 pb-12 sm:pb-16 lg:pb-24">
        <div className="flex flex-col lg:flex-row items-end justify-between w-full">
          
          {/* LEFT — Headline & CTAs */}
          <div className="max-w-4xl mb-8 sm:mb-12 lg:mb-0">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[clamp(2rem,8vw,5rem)] font-medium leading-[1.1] tracking-tight text-white mb-8 sm:mb-10"
            >
              Tune out the noise, <br className="hidden sm:block" />
              Tune into yourself with <br className="hidden sm:block" />
              only FlowBoard.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <button className="w-full sm:w-auto px-8 py-3.5 border border-white/40 text-white rounded-full text-[12px] font-bold tracking-widest hover:bg-white/10 transition-all uppercase">
                Products
              </button>
              <button className="w-full sm:w-auto group flex items-center justify-between sm:justify-center gap-4 px-8 py-3.5 bg-white text-[#2F3A35] rounded-full text-[12px] font-bold tracking-widest hover:bg-white/90 transition-all uppercase">
                Get Started
                <div className="w-7 h-7 bg-[#8CBA41] rounded-full flex items-center justify-center text-white transition-transform group-hover:rotate-45">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
