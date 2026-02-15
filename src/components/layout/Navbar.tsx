"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Features", href: "#features" },
  { label: "Blog", href: "#blog" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-cream/80 backdrop-blur-md border-b border-border-soft/50">
        <Container>
          <div className="flex h-16 sm:h-20 items-center justify-between relative">
            
            {/* Left Nav (Desktop) */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.slice(0, 3).map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="text-[13px] font-medium text-deep-blue/70 transition-colors hover:text-deep-blue"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile: Logo Left-aligned | Desktop: Logo Centered */}
            <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
              <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-deep-blue shadow-soft">
                  <span className="text-sm font-bold text-cream">F</span>
                </div>
                <span className="text-xl sm:text-2xl font-serif font-bold text-deep-blue tracking-tight">
                  Flowboard
                </span>
              </Link>
            </div>

            {/* Right Nav & CTA (Desktop) */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.slice(3).map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="text-[13px] font-medium text-deep-blue/70 transition-colors hover:text-deep-blue"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/dashboard">
                <button className="flex items-center gap-2 bg-deep-blue text-cream px-5 py-2.5 rounded-full text-[13px] font-semibold transition-transform hover:scale-105 active:scale-95">
                  Get started
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {/* Mobile Toggle — 44px minimum touch target */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden ml-auto w-11 h-11 flex items-center justify-center rounded-xl text-deep-blue hover:bg-surface-sunken transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>
      </header>

      {/* ─── Mobile Slide-in Drawer ─── */}
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 z-60 bg-deep-blue/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-70 h-dvh w-[min(85vw,360px)] bg-cream shadow-elevated flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border-soft shrink-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-deep-blue/40">
            Navigation
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-11 h-11 flex items-center justify-center rounded-xl text-deep-blue hover:bg-surface-sunken transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center h-12 px-4 text-base font-medium text-deep-blue/70 hover:text-deep-blue hover:bg-surface-sunken rounded-xl transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Drawer CTA */}
        <div className="px-6 pb-8 pt-4 border-t border-border-soft shrink-0">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            <button className="w-full flex items-center justify-center gap-2 bg-deep-blue text-cream py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-soft hover:bg-deep-blue-dark transition-colors">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-deep-blue/25">
            FlowBoard © 2026
          </p>
        </div>
      </div>
    </>
  );
}
