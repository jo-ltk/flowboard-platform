"use client";

import { Menu, Bell, Search, ExternalLink } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { useDemoMode } from "@/context/DemoContext";
import { DemoMode } from "@/components/system/DemoMode";
import { siteConfig } from "@/lib/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function DashboardNavbar() {
  const { toggleMobile } = useSidebar();
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <header className={cn(
      "flex shrink-0 items-center justify-between bg-white border-b border-[#DDE5E1] px-4 lg:px-6 relative z-40 font-[Poppins] transition-all duration-300",
      "h-[56px] lg:h-16",
      "shadow-sm lg:shadow-none"
    )}>
      <DemoMode />

      {/* Left section */}
      <div className="flex items-center gap-3 lg:gap-6">
        <button
          onClick={toggleMobile}
          className="inline-flex items-center justify-center rounded-none border border-[#DDE5E1] p-2 text-[#2F3A35] transition-all hover:bg-[#F4F7F5] lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo for mobile */}
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-[#2F3A35] text-white">
            <img src="/assets/logo.svg" alt="FlowBoard" className="w-4 h-4 object-contain invert" />
          </div>
          <span className="text-[12px] font-black text-[#2F3A35] uppercase tracking-[0.2em] hidden sm:block">
            {siteConfig.name}
          </span>
        </Link>

        {/* Search - Architectural Design */}
        <div className="hidden items-center gap-3 bg-[#F4F7F5] border border-[#DDE5E1] px-4 py-2 sm:flex focus-within:bg-white focus-within:border-[#8CBA41] transition-all duration-300">
          <Search className="h-4 w-4 text-[#8A9E96]" />
          <input
            type="text"
            placeholder="Search Intelligence..."
            className="w-40 bg-transparent text-[13px] text-[#2F3A35] placeholder:text-[#8A9E96]/60 outline-none font-medium uppercase tracking-wider lg:w-72"
          />
        </div>

        {/* Demo Mode Toggle - Sharp */}
        <button
          onClick={toggleDemoMode}
          className={`hidden md:flex items-center gap-2 px-6 h-10 border transition-all duration-500 text-[10px] font-bold uppercase tracking-[0.2em] ${
            isDemoMode
              ? "bg-[#2F3A35] border-[#2F3A35] text-white"
              : "bg-white border-[#DDE5E1] text-[#2F3A35] hover:bg-[#F4F7F5]"
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-none ${isDemoMode ? "bg-[#8CBA41] animate-pulse" : "bg-[#DDE5E1]"}`} />
          {isDemoMode ? "System Live" : "Demo Protocol"}
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center h-full">
        {/* Visit site - Sharp CTA */}
        <Link
          href="/"
          className="hidden h-full lg:flex items-center gap-2 px-6 border-l border-[#DDE5E1] text-[#2F3A35] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#F4F7F5] transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Public View
        </Link>

        {/* Notifications - Architectural */}
        <button
          className="relative inline-flex items-center justify-center h-full px-4 lg:px-6 border-l border-[#DDE5E1] text-[#2F3A35] transition-all hover:bg-[#F4F7F5] group"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-4 lg:right-5 top-4 lg:top-5 h-2 w-2 rounded-none bg-[#8CBA41]" />
        </button>

        {/* User Identity - Square */}
        <button
          className="flex h-full px-4 lg:px-6 items-center justify-center border-l border-[#DDE5E1] bg-[#2F3A35] text-[11px] font-bold tracking-widest text-white transition-all hover:bg-black uppercase"
          aria-label="User menu"
        >
          <span className="border-b border-[#8CBA41] pb-0.5">JD</span>
        </button>
      </div>
    </header>
  );
}

