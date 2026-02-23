"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const FloatingNav = () => {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);

  // Scale down slightly on scroll
  const scale = useTransform(scrollY, [0, 100], [1, 0.98]);
  const y = useTransform(scrollY, [0, 100], [0, 12]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.nav
      style={{ scale, y }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[850px] px-6 hidden sm:block"
    >
      <div className="glass-panel nav-shadow bg-surface-elevated/80 backdrop-blur-xl border border-border-blue/30 px-6 py-4 flex items-center justify-between rounded-full">
        {/* Left: Minimal Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <img src="/assets/logo.svg" alt="FlowBoard" className="w-6 h-6 object-contain" />
          <span className="text-lg font-syne font-bold tracking-tight text-sage-deep">FlowBoard</span>
        </Link>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-10">
          {["System", "Modules", "Directives", "Archive"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-mono text-[10px] uppercase tracking-widest text-sage-deep/50 hover:text-sage-deep transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right: CTA Button */}
        <div className="magnetic-wrap">
          <Link href="/dashboard">
            <button className="bg-sage-deep text-cream px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-sage-deep-dark transition-all duration-300 shadow-soft hover:shadow-glow-blue">
              Initialize
            </button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default FloatingNav;
