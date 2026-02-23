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
    <header className="flex h-16 shrink-0 items-center justify-between bg-white border-b border-[#DDE5E1] px-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] relative z-40">
      <DemoMode />

      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="inline-flex items-center justify-center rounded-xl p-2.5 text-[#8A9E96] transition-all hover:bg-[#F4F7F5] hover:text-[#5C6B64] md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Demo Mode Toggle */}
        <button
          onClick={toggleDemoMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 text-[11px] font-semibold uppercase tracking-[0.08em] ${
            isDemoMode
              ? "bg-[#7C9A8B]/12 border-[#7C9A8B]/30 text-[#5F7D6E] shadow-sm"
              : "bg-[#F4F7F5] border-[#DDE5E1] text-[#8A9E96] hover:border-[#AFC8B8] hover:text-[#5C6B64]"
          }`}
        >
          <PlayCircle className={`w-3.5 h-3.5 ${isDemoMode ? "text-[#7C9A8B]" : ""}`} />
          {isDemoMode ? "Demo Active" : "Demo Mode"}
        </button>

        {/* Search */}
        <div className="hidden items-center gap-2.5 rounded-xl border border-[#DDE5E1] bg-[#F4F7F5] px-4 py-2.5 sm:flex focus-within:ring-2 focus-within:ring-[#7C9A8B]/20 focus-within:border-[#AFC8B8] transition-all duration-200">
          <Search className="h-3.5 w-3.5 text-[#8A9E96]" />
          <input
            type="text"
            placeholder="Search projects, tasks..."
            className="w-40 bg-transparent text-sm text-[#2F3A35] placeholder:text-[#8A9E96] outline-none font-light lg:w-64"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Visit site */}
        <Link
          href="/"
          className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DDE5E1] text-[#8A9E96] text-[11px] font-semibold uppercase tracking-[0.08em] hover:bg-[#F4F7F5] hover:text-[#5C6B64] transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Site
        </Link>

        {/* Notifications */}
        <button
          className="relative inline-flex items-center justify-center rounded-xl p-2.5 text-[#8A9E96] transition-all hover:bg-[#F4F7F5] hover:text-[#5C6B64] group"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#7C9A8B]" />
        </button>

        {/* User avatar */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7C9A8B] text-xs font-semibold text-white transition-all hover:bg-[#5F7D6E] hover:shadow-md active:scale-[0.97]"
          aria-label="User menu"
        >
          JD
        </button>
      </div>
    </header>
  );
}
