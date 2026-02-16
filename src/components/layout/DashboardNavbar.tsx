"use client";

import { Menu, Bell, Search, PlayCircle, ExternalLink } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { useDemoMode } from "@/context/DemoContext";
import { DemoMode } from "@/components/system/DemoMode";
import Link from "next/link";

export function DashboardNavbar() {
  const { toggle } = useSidebar();
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <header className="flex h-24 shrink-0 items-center justify-between bg-cream px-10">
      <DemoMode />
      
      {/* Left section */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggle}
          className="inline-flex items-center justify-center rounded-xl p-3 text-deep-blue/40 transition-all hover:bg-surface-sunken hover:text-deep-blue md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Demo Mode Toggle */}
        <button
          onClick={toggleDemoMode}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-500 font-syne font-bold text-[10px] uppercase tracking-[0.15em] ${
            isDemoMode 
              ? "bg-light-green border-light-green text-deep-blue shadow-[0_0_20px_rgba(231,241,168,0.5)]" 
              : "bg-white border-soft-blue/10 text-deep-blue/40 hover:border-soft-blue/30"
          }`}
        >
          <PlayCircle className={`w-4 h-4 ${isDemoMode ? "animate-pulse" : ""}`} />
          {isDemoMode ? "Demo Mode Active" : "Enter Demo Mode"}
        </button>

        {/* Search */}
        <div className="hidden items-center gap-3 rounded-2xl border border-border-blue/50 bg-white/50 px-5 py-3 sm:flex focus-within:ring-4 focus-within:ring-soft-blue/10 transition-all duration-300">
          <Search className="h-4 w-4 text-soft-blue" />
          <input
            type="text"
            placeholder="Search commands..."
            className="w-48 bg-transparent text-xs font-bold uppercase tracking-widest text-deep-blue placeholder:text-deep-blue/20 outline-none lg:w-96"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6">
        {/* Landing Page Link */}
        <Link
          href="/"
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-soft-blue/10 text-deep-blue/40 font-syne font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-white hover:text-deep-blue transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Visit Site
        </Link>

        {/* Notifications */}
        <button
          className="relative inline-flex items-center justify-center rounded-xl p-3 text-deep-blue/40 transition-all hover:bg-surface-sunken hover:text-deep-blue group"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-light-green border-2 border-cream" />
        </button>

        {/* User avatar */}
        <button
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-deep-blue text-xs font-bold text-cream transition-all hover:scale-105 shadow-soft hover:shadow-medium"
          aria-label="User menu"
        >
          JD
        </button>
      </div>
    </header>
  );
}
