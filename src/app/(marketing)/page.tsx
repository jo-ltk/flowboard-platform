import Hero from "@/components/sections/Hero";
import Statement from "@/components/sections/Statement";
import FeatureGrid from "@/components/sections/FeatureGrid";
import AIDemo from "@/components/sections/AIDemo";
import SocialProof from "@/components/sections/SocialProof";
import Pricing from "@/components/sections/Pricing";
import Blog from "@/components/sections/Blog";
import FlowBoardChatbot from "@/components/chat/FlowBoardChatbot";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "FlowBoard — Calm, AI-Powered Project Management",
  description:
    "FlowBoard gives your team structured productivity with AI-powered scheduling and human-centered design. Start free today.",
};

export default function MarketingPage() {
  return (
    <main className="flex flex-col w-full bg-[#F4F7F5] overflow-x-hidden">
      <Hero />
      <Statement />
      <FeatureGrid />
      <AIDemo />
      <SocialProof />
      <Pricing />
      <Blog />

      <FlowBoardChatbot />


      {/* Final CTA Section - High-End Redesign */}
      <section
        id="contact"
        className="relative min-h-[90vh] w-full bg-[#1A1F1D] overflow-hidden flex items-center font-[Poppins]"
        style={{ scrollMarginTop: "5rem" }}
      >
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
            alt="Ready to Flow" 
            className="w-full h-full object-cover opacity-30 grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#1A1F1D] via-[#1A1F1D]/90 to-transparent" />
          
          {/* Subtle Technical Grid */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#8CBA41 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative z-10 w-full px-8 sm:px-14 lg:px-20 py-20">
          <div className="max-w-5xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-px bg-[#8CBA41]" />
              <span className="text-[11px] font-black text-[#8CBA41] uppercase tracking-[0.4em]">
                DEPLOYMENT PROTOCOL
              </span>
            </div>
            
            <h2 className="text-[clamp(2.5rem,8vw,6.5rem)] font-black text-white leading-[0.9] tracking-tighter mb-12">
              Ready to <span className="text-[#8CBA41] italic">flow?</span> <br />
              Your clarity starts here.
            </h2>
            
            <div className="flex flex-col lg:flex-row lg:items-center gap-16 mb-16">
              <p className="text-[#AFC8B8] text-lg sm:text-xl font-light max-w-xl leading-relaxed">
                Join 2,400+ world-class teams who found their focus. 
                Experience a platform designed for the <span className="text-white font-medium uppercase tracking-widest text-sm">Architectural Pace</span> of modern work.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="group relative w-full sm:w-auto px-16 py-6 bg-[#8CBA41] text-white font-black rounded-none text-[11px] tracking-[0.4em] uppercase hover:bg-white hover:text-[#1A1F1D] transition-all duration-500 overflow-hidden flex items-center justify-center gap-4">
                    <span className="relative z-10">Get Started Free</span>
                    <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                </Link>
                
                <Link
                  href="#features"
                  className="group flex items-center gap-4 text-[10px] font-black text-white/50 hover:text-[#8CBA41] transition-all uppercase tracking-[0.3em]"
                >
                  <span className="border-b border-white/20 group-hover:border-[#8CBA41]/50 pb-1 transition-all">Explore Capabilities</span>
                </Link>
              </div>
            </div>
            
            <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-10">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black text-[#8A9E96] uppercase tracking-[0.4em]">
                  FLOWBOARD PLATFORM 0.4
                </p>
                <p className="text-[9px] font-bold text-[#5C6B64] uppercase tracking-[0.1em]">
                  © 2026 Architectural Productivity Systems Inc.
                </p>
              </div>
              
              <div className="flex items-center gap-12">
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[9px] font-black text-[#AFC8B8] uppercase tracking-[0.2em]">SOC2 COMPLIANT</span>
                  <div className="w-8 h-px bg-[#8CBA41]/30" />
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[9px] font-black text-[#AFC8B8] uppercase tracking-[0.2em]">SAML READY</span>
                  <div className="w-8 h-px bg-[#8CBA41]/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
