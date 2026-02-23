"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/constants";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Check simulated auth state
    const authStatus = typeof window !== 'undefined' && localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(authStatus);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    window.location.reload();
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "bg-white/95 backdrop-blur-sm border-b border-[#DDE5E1] py-4"
            : "bg-transparent border-b border-white/10 py-6"
        )}
      >
        <Container>
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-4 group shrink-0">
              <div className={cn(
                "w-10 h-10 flex items-center justify-center transition-all duration-500 rounded-none border",
                scrolled ? "bg-[#2F3A35] border-[#2F3A35] text-white" : "bg-white border-white text-[#2F3A35]"
              )}>
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
              <span
                className={cn(
                  "text-[14px] font-black tracking-[0.3em] uppercase transition-colors hidden sm:block",
                  scrolled ? "text-[#2F3A35]" : "text-white"
                )}
              >
                {siteConfig.name}
              </span>
            </Link>

            {/* Center Nav (Desktop) */}
            <nav className="hidden lg:flex items-center gap-12">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.25em] transition-all relative group",
                    scrolled
                      ? "text-[#2F3A35] hover:text-[#8CBA41]"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full",
                    scrolled ? "bg-[#8CBA41]" : "bg-white"
                  )} />
                </Link>
              ))}
            </nav>

            {/* CTA (Desktop) */}
            <div className="hidden lg:flex items-center gap-8">
              {!isLoggedIn ? (
                <>
                  <Link href="/login" className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.25em] transition-colors relative group",
                    scrolled ? "text-[#8A9E96] hover:text-[#2F3A35]" : "text-white/60 hover:text-white"
                  )}>
                    Sign In
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
                  </Link>
                  <Link href="/dashboard">
                    <button className={cn(
                      "px-8 py-4 rounded-none text-[10px] font-black tracking-[0.25em] uppercase transition-all duration-500 border",
                      scrolled
                        ? "bg-[#2F3A35] text-white border-[#2F3A35] hover:bg-black"
                        : "bg-white text-[#2F3A35] border-white hover:bg-transparent hover:text-white"
                    )}>
                      Get Started
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleLogout}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.25em] transition-colors relative group",
                      scrolled ? "text-[#8A9E96] hover:text-[#2F3A35]" : "text-white/60 hover:text-white"
                    )}
                  >
                    Sign Out
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
                  </button>
                  <Link href="/dashboard">
                    <button className={cn(
                      "px-8 py-4 rounded-none text-[10px] font-black tracking-[0.25em] uppercase transition-all duration-500 border",
                      scrolled
                        ? "bg-[#8CBA41] text-[#2F3A35] border-[#8CBA41] hover:bg-[#2F3A35] hover:text-white"
                        : "bg-[#8CBA41] text-[#2F3A35] border-[#8CBA41] hover:bg-white hover:border-white"
                    )}>
                      Dashboard
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "lg:hidden w-12 h-12 flex items-center justify-center rounded-none border transition-all",
                scrolled
                  ? "text-[#2F3A35] border-[#DDE5E1] hover:bg-[#f8faf9]"
                  : "text-white border-white/20 hover:bg-white/10"
              )}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-70 h-dvh w-full sm:w-[400px] bg-white flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-8 h-24 border-b border-[#DDE5E1] bg-[#f8faf9]">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8A9E96]">
            Protocols
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-12 h-12 flex items-center justify-center border border-[#DDE5E1] text-[#2F3A35] hover:bg-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-8 py-12 flex flex-col gap-8">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className="group flex items-center justify-between"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#8A9E96] mb-1">0{i + 1}</span>
                <span className="text-3xl font-bold uppercase tracking-tighter text-[#2F3A35] group-hover:text-[#8CBA41] transition-colors">
                  {link.label}
                </span>
              </div>
              <ArrowRight className="w-6 h-6 text-[#DDE5E1] group-hover:text-[#8CBA41] group-hover:translate-x-2 transition-all" />
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-[#DDE5E1] bg-[#f8faf9] flex flex-col gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <button className="w-full bg-white border border-[#DDE5E1] text-[#2F3A35] py-5 rounded-none font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-[#2F3A35] hover:text-white transition-all">
                  Sign In to Account
                </button>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <button className="w-full bg-[#2F3A35] text-white py-5 rounded-none font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3">
                  Initialize Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </>
          ) : (
            <>
              <button 
                onClick={handleLogout}
                className="w-full bg-white border border-[#DDE5E1] text-[#2F3A35] py-5 rounded-none font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-600 transition-all border-dashed"
              >
                Sign Out from Session
              </button>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <button className="w-full bg-[#8CBA41] text-[#2F3A35] py-5 rounded-none font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-[#2F3A35] hover:text-white transition-all flex items-center justify-center gap-3">
                  Pulse Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </>
          )}
          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] font-bold text-[#8A9E96] uppercase tracking-[0.2em]">SECURE ACCESS 2026</span>
            <div className="h-px w-12 bg-[#8CBA41]" />
          </div>
        </div>
      </div>

    </>
  );
}
