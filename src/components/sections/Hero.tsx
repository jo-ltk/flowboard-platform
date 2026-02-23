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
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="/assets/hero/Gemini_2.png"
          alt="Modern Architecture — FlowBoard"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      <div className="relative z-10 w-full h-full flex flex-col justify-end px-6 sm:px-14 lg:px-20 pb-12 sm:pb-16 lg:pb-24">
        <div className="flex flex-col lg:flex-row items-end justify-between w-full">
          
          {/* LEFT — Headline & CTAs */}
          <div className="max-w-4xl mb-8 sm:mb-12 lg:mb-0">
           <motion.h1
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="text-[2rem] sm:text-[3rem] lg:text-[4rem] font-medium leading-[1.15] tracking-tight text-white mb-8 sm:mb-10"
>
  Master your workflow. <br className="hidden sm:block" />
  Streamline with FlowBoard.
</motion.h1>

           <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
  className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
>
 <Link
  href="#features"
  className="w-full sm:w-auto px-8 py-[15px] bg-black/20 backdrop-blur-md border border-white/30 text-white text-[13px] font-semibold tracking-wide hover:bg-white hover:text-black transition-all uppercase text-center"
>
  Learn More
</Link>

  <Link
    href="/login"
    className="w-full sm:w-auto group flex items-center justify-between gap-6 pl-8 pr-[6px] py-[6px] bg-white text-black text-[13px] font-semibold tracking-wide hover:bg-gray-200 transition-all uppercase"
  >
    Initialize Flow
    <div className="w-10 h-10 bg-[#8CBA41] flex items-center justify-center text-white transition-transform group-hover:bg-[#7ba335]">
      <ArrowRight className="w-5 h-5 -rotate-45" />
    </div>
  </Link>
</motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
