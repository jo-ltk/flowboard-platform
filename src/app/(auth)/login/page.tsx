"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Github, Chrome } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/constants";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    localStorage.setItem("isLoggedIn", "true");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8faf9] flex flex-col lg:flex-row font-[Poppins]">
      
      {/* ─── Left Panel: Brand Statement ─── */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#2F3A35] relative overflow-hidden flex-col justify-between p-16">
        {/* Abstract Architectural BG Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-px bg-white/20 transform rotate-45 translate-y-[100px]" />
          <div className="absolute top-0 left-0 w-full h-px bg-white/20 transform rotate-45 translate-y-[300px]" />
          <div className="absolute top-0 left-0 w-full h-px bg-white/20 transform rotate-45 translate-y-[500px]" />
          <div className="absolute top-0 left-0 h-full w-px bg-white/20 transform rotate-45 translate-x-[200px]" />
          <div className="absolute top-0 left-0 h-full w-px bg-white/20 transform rotate-45 translate-x-[400px]" />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-4 group">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-none">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[#2F3A35]" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
          <span className="text-[16px] font-black text-white uppercase tracking-[0.4em]">
            {siteConfig.name}
          </span>
        </Link>

        <div className="relative z-10">
          <h1 className="text-5xl font-medium text-white leading-[1.1] tracking-tight mb-8">
            Access your <br />
            <span className="text-[#8CBA41]">Intelligence Hub.</span>
          </h1>
          <p className="text-white/60 text-lg font-light max-w-md leading-relaxed">
            Standardizing the way modern teams orchestrate complex workflows. Initialize your session to continue.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="h-px w-12 bg-[#8CBA41]" />
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">
            Protocol v4.2.0 — Secure Edge
          </p>
        </div>
      </div>

      {/* ─── Right Panel: Login Form ─── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 relative bg-white">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[420px]"
        >
          {/* Header */}
          <div className="mb-12">
            <span className="text-[10px] font-bold text-[#8CBA41] uppercase tracking-[0.3em] mb-3 block">
              Authentication
            </span>
            <h2 className="text-3xl font-bold text-[#2F3A35] uppercase tracking-tighter">
              Login to FlowBoard
            </h2>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <button className="flex items-center justify-center gap-3 py-4 border border-[#DDE5E1] rounded-none hover:bg-[#f8faf9] transition-all group">
              <Github className="w-4 h-4 text-[#2F3A35]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F3A35]">GitHub</span>
            </button>
            <button className="flex items-center justify-center gap-3 py-4 border border-[#DDE5E1] rounded-none hover:bg-[#f8faf9] transition-all group">
              <Chrome className="w-4 h-4 text-[#2F3A35]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F3A35]">Google</span>
            </button>
          </div>

          <div className="relative flex items-center mb-10">
            <div className="grow h-px bg-[#DDE5E1]" />
            <span className="shrink mx-4 text-[9px] font-bold text-[#8A9E96] uppercase tracking-[0.2em]">OR LOGIN WITH EMAIL</span>
            <div className="grow h-px bg-[#DDE5E1]" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#8A9E96] uppercase tracking-[0.2em] ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9E96]" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-[#f8faf9] border border-[#DDE5E1] rounded-none outline-none focus:border-[#2F3A35] focus:bg-white transition-all text-sm font-medium text-[#2F3A35]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-[#8A9E96] uppercase tracking-[0.2em]">
                  Password
                </label>
                <Link href="#" className="text-[9px] font-bold text-[#8CBA41] uppercase tracking-[0.2em] hover:text-[#2F3A35] transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9E96]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-[#f8faf9] border border-[#DDE5E1] rounded-none outline-none focus:border-[#2F3A35] focus:bg-white transition-all text-sm font-medium text-[#2F3A35]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2F3A35] text-white py-5 rounded-none font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-3 mt-8"
            >
              {isLoading ? "Authenticating..." : "Initialize Dashboard"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-12 text-center text-[11px] font-medium text-[#8A9E96]">
            Don't have an account?{" "}
            <Link href="#" className="font-bold text-[#2F3A35] hover:text-[#8CBA41] transition-colors uppercase tracking-widest ml-1">
              Request Access
            </Link>
          </p>
        </motion.div>

        {/* Brand Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-px h-full bg-[#2F3A35] transform -rotate-45" />
          <div className="absolute top-0 right-0 w-px h-full bg-[#2F3A35] transform -rotate-45 translate-x-8" />
        </div>
      </div>
    </div>
  );
}
