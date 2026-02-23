"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const POSTS = [
  {
    title: "The Architecture of Deep Focus",
    category: "Productivity",
    date: "Sep 12, 2026",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    excerpt: "How redesigning your workspace methodology can unlock sustained states of deep work without burning out.",
  },
  {
    title: "AI Orchestration in Modern Teams",
    category: "Technology",
    date: "Sep 08, 2026",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Moving beyond basic task delegation. How true AI orchestration transforms team velocity and clarity.",
  },
  {
    title: "Leading with Structural Clarity",
    category: "Leadership",
    date: "Aug 29, 2026",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Why transparent project architectures consistently outperform rigid top-down management styles.",
  },
];

export default function Blog() {
  return (
    <section
      id="blog"
      className="relative w-full bg-white py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden font-[Poppins]"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold text-[#8A9E96] uppercase tracking-[0.4em] mb-4 block">
              RESEARCH & INSIGHTS
            </span>
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-[#2F3A35] leading-none tracking-tighter mb-8">
              Frameworks for <br />
              <span className="text-[#8CBA41] italic">better flow.</span>
            </h2>
          </div>
          <button className="flex items-center gap-4 text-[10px] font-black text-[#8A9E96] hover:text-[#2F3A35] transition-all uppercase tracking-[0.4em] border-b border-[#8A9E96]/30 hover:border-[#2F3A35] pb-2">
            View All Journals
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {POSTS.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative w-full aspect-4/3 mb-8 overflow-hidden bg-[#f8faf9] border border-[#DDE5E1]/50">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                />
                <div className="absolute top-0 left-0 bg-[#8CBA41] text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] m-4">
                  {post.category}
                </div>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-bold text-[#8A9E96] uppercase tracking-[0.3em] mb-4">
                <div className="w-6 h-px bg-[#DDE5E1]" />
                {post.date}
              </div>
              <h3 className="text-2xl font-black text-[#2F3A35] leading-tight tracking-tighter mb-4 group-hover:text-[#8CBA41] transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-[#5C6B64] text-sm font-light leading-relaxed">
                {post.excerpt}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
