"use client";

import React from "react";
import { FileText, Sparkles } from "lucide-react";
import Link from "next/link";

export function NarrativeReport() {
  return (
    <Link
      href="/report"
      className="w-full h-14 flex items-center justify-center gap-4 px-8  bg-sage-deep text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-sage-deep/90 hover:shadow-2xl hover:shadow-sage-deep/30 active:scale-[0.98] transition-all duration-500 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-r from-light-green/0 via-light-green/10 to-light-green/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <FileText className="w-4 h-4 group-hover:rotate-12 transition-transform" />
      <span className="relative z-10 flex items-center gap-2">
        Generate Executive Narrative
        <Sparkles className="w-3 h-3 text-light-green opacity-40 group-hover:opacity-100" />
      </span>
    </Link>
  );
}
