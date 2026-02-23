import Hero from "@/components/sections/Hero";
import Statement from "@/components/sections/Statement";
import FeatureGrid from "@/components/sections/FeatureGrid";
import AIDemo from "@/components/sections/AIDemo";
import SocialProof from "@/components/sections/SocialProof";
import Pricing from "@/components/sections/Pricing";
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

      <FlowBoardChatbot />

      {/* Final CTA Section - Architectural Redesign */}
      <section
        id="contact"
        className="relative h-screen w-full bg-[#2F3A35] overflow-hidden flex items-center font-[Poppins]"
        style={{ scrollMarginTop: "5rem" }}
      >
        {/* Background Image - Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/id/1015/1920/1080" 
            alt="Ready to Flow" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#2F3A35] via-[#2F3A35]/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-8 sm:px-14 lg:px-20">
          <div className="max-w-4xl">
            <span className="text-[12px] font-bold text-[#8CBA41] uppercase tracking-[0.4em] mb-8 block">
              The Path to Clarity
            </span>
            
            <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold text-white leading-[1] tracking-tighter mb-10">
              Ready to <span className="text-[#8CBA41]">flow?</span> <br />
              Your clarity starts here.
            </h2>
            
            <p className="text-[#AFC8B8] text-lg sm:text-xl font-light max-w-xl mb-12 leading-relaxed italic border-l-2 border-[#8CBA41] pl-8">
              Join 2,400+ world-class teams who found their focus. <br className="hidden sm:block" />
              Free to start, no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-12 py-5 bg-[#8CBA41] text-white font-bold rounded-none text-[12px] tracking-[0.25em] uppercase hover:bg-white hover:text-[#2F3A35] transition-all duration-300 flex items-center justify-center gap-3">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              
              <Link
                href="#features"
                className="text-[11px] font-bold text-white/60 hover:text-[#8CBA41] transition-all uppercase tracking-[0.2em] border-b border-white/20 pb-1"
              >
                Explore Capabilities
              </Link>
            </div>
            
            <div className="mt-24 pt-12 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 max-w-2xl">
              <p className="text-[11px] font-medium text-[#8A9E96] uppercase tracking-[0.2em]">
                FlowBoard Platform · 2026
              </p>
              <div className="flex items-center gap-8">
                <span className="text-[11px] font-bold text-[#AFC8B8] uppercase tracking-[0.1em]">SOC2 Compliant</span>
                <span className="text-[11px] font-bold text-[#AFC8B8] uppercase tracking-[0.1em]">SAML Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
