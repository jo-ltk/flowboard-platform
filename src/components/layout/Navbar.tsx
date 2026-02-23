"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Blog", href: "#blog" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-[#DDE5E1] shadow-[0_2px_16px_rgba(0,0,0,0.05)]"
            : "bg-transparent border-b border-white/12"
        )}
      >
        <Container>
          <div className="flex h-16 sm:h-20 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 flex items-center justify-center bg-white rounded-[10px] shadow-sm">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#2F3A35]" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </div>
              <span
                className={cn(
                  "text-[1.15rem] font-bold tracking-tight transition-colors hidden sm:block",
                  scrolled ? "text-[#2F3A35]" : "text-white"
                )}
              >
                FlowBoard
              </span>
            </Link>

            {/* Center Nav (Desktop) */}
            <nav className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-[13px] font-medium transition-opacity",
                    scrolled
                      ? "text-[#2F3A35] hover:opacity-100 opacity-80"
                      : "text-white/80 hover:opacity-100"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA (Desktop) */}
            <div className="hidden lg:flex items-center">
              <Link href="/dashboard">
                <button className="flex items-center gap-2 bg-white text-[#2F3A35] px-6 py-2.5 rounded-full text-[12px] font-bold tracking-wider hover:bg-white/90 active:scale-[0.98] transition-all duration-200">
                  GET A DEMO
                </button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "lg:hidden w-11 h-11 flex items-center justify-center rounded-xl transition-colors",
                scrolled
                  ? "text-[#2F3A35] hover:bg-[#E9EFEC]"
                  : "text-white hover:bg-white/10"
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-60 bg-[#2F3A35]/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-70 h-dvh w-[min(85vw,340px)] bg-white shadow-[0_0_60px_rgba(0,0,0,0.15)] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-[#DDE5E1] shrink-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8A9E96]">
            Menu
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[#2F3A35] hover:bg-[#E9EFEC] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center h-12 px-4 text-[#5C6B64] font-medium hover:text-[#2F3A35] hover:bg-[#E9EFEC] rounded-xl transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-6 pb-8 pt-4 border-t border-[#DDE5E1] shrink-0 space-y-3">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            <button className="w-full flex items-center justify-center gap-2 bg-[#7C9A8B] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-[#5F7D6E] transition-colors">
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <p className="text-center text-[10px] text-[#8A9E96] uppercase tracking-[0.15em]">
            FlowBoard © 2026
          </p>
        </div>
      </div>
    </>
  );
}
