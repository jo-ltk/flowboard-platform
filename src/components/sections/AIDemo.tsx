"use client";

import React from "react";
import { Cpu, CheckCircle, Zap, Activity, MessageSquare } from "lucide-react";

const AIDemo = () => {
  return (
    <section className="relative min-h-screen w-full bg-surface-tinted overflow-hidden py-16 sm:py-24 px-5 sm:px-6 md:px-12 lg:px-20 flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-b from-cream to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-cream to-transparent pointer-events-none z-20" />
      <div className="absolute inset-0 pastel-dots pointer-events-none opacity-20 sm:opacity-30" />
      <div className="absolute top-[30%] left-[10%] sm:left-[20%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-soft-blue/8 blur-2xl sm:blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] sm:right-[15%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-light-green/10 blur-2xl sm:blur-3xl pointer-events-none" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-20 items-center relative z-10">
        {/* Left Side: Editorial Text Block */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8 text-center lg:text-left">
          <div className="space-y-4 sm:space-y-5">
            <span className="inline-flex font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-deep-blue/50 bg-deep-blue/5 px-3 py-1.5 rounded-full">
              Intelligent System
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-syne font-bold leading-[0.9] tracking-tight text-deep-blue">
              AI THAT <br className="hidden sm:block" />
              <span className="text-soft-blue">THINKS</span> IN <br className="hidden sm:block" />
              STRUCTURE.
            </h2>
          </div>

          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-deep-blue/50 border-l-3 border-light-green pl-5 sm:pl-6 max-w-md mx-auto lg:mx-0 text-left">
            &ldquo;The future of design isn&apos;t automated; it&apos;s synthetically augmented.&rdquo;
          </p>

          <p className="text-sm text-deep-blue/40 leading-relaxed max-w-sm mx-auto lg:mx-0">
            FlowBoard uses advanced neural mapping to predict your next move. 
            Real-time heuristic analysis meets thoughtful design for the ultimate creative experience.
          </p>

          <div className="pt-2 flex justify-center lg:justify-start">
            <button className="group relative px-8 py-3.5 bg-deep-blue text-cream font-semibold uppercase text-xs tracking-widest overflow-hidden rounded-[var(--radius-md)] transition-all hover:bg-deep-blue-dark min-h-[44px]">
              <span className="relative z-10 flex items-center gap-2">
                Deploy Instance
              </span>
            </button>
          </div>
        </div>

        {/* Right Side: Glass AI Panel */}
        <div className="lg:col-span-7">
          <div className="relative group">
            <div className="p-px border border-border-soft rounded-lg">
              <div className="glass-panel bg-surface-elevated/90 p-5 sm:p-8 min-h-[400px] sm:min-h-[480px] flex flex-col gap-5 sm:gap-7 rounded-lg">
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-border-soft pb-4 sm:pb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-soft-blue/10 flex items-center justify-center rounded-[var(--radius-md)] border border-soft-blue/20">
                      <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-soft-blue" />
                    </div>
                    <div>
                      <h4 className="font-syne font-bold text-[10px] sm:text-xs uppercase tracking-widest text-deep-blue">Core Sentinel</h4>
                      <p className="font-mono text-[8px] sm:text-[9px] text-deep-blue/35 mt-0.5">Status: Ready</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-light-green" />
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-border-soft" />
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-border-soft" />
                  </div>
                </div>

                {/* Task List */}
                <div className="space-y-2 sm:space-y-3">
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-deep-blue/30">Active Tasks</span>
                  {[
                    { label: "Refactoring Module-X", progress: 85, color: "soft-blue" },
                    { label: "Optimizing WebGL Shader", progress: 42, color: "light-green" },
                    { label: "Synthesizing UI Tokens", progress: 100, color: "deep-blue" }
                  ].map((task, i) => (
                    <div 
                      key={i}
                      className="group/row flex items-center justify-between p-2.5 sm:p-3 border border-border-soft rounded-md bg-surface-primary/60 transition-colors hover:bg-soft-blue/5"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        {task.progress === 100 ? (
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-light-green-dark shrink-0" />
                        ) : (
                          <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-deep-blue/20 shrink-0" />
                        )}
                        <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-deep-blue/70 group-hover/row:text-deep-blue transition-colors truncate">
                          {task.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
                        <div className="w-16 sm:w-24 h-1.5 bg-border-soft rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${task.progress}%` }}
                            className={`h-full rounded-full ${
                              task.color === 'soft-blue' ? 'bg-soft-blue' : 
                              task.color === 'light-green' ? 'bg-light-green-dark' : 
                              'bg-deep-blue'
                            }`}
                          />
                        </div>
                        <span className="font-mono text-[9px] sm:text-[10px] text-deep-blue/35 w-6 text-right">{task.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Suggestion Box */}
                <div className="mt-auto border-t border-border-soft pt-4 sm:pt-6">
                  <div className="bg-soft-blue/6 border border-border-blue rounded-[var(--radius-md)] p-4 sm:p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-soft-blue rounded-l-full" />
                    <div className="flex items-start gap-3 sm:gap-4 pl-2">
                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-soft-blue shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-soft-blue font-bold mb-1 sm:mb-1.5">AI Suggestion</p>
                        <p className="text-[11px] sm:text-xs text-deep-blue/55 leading-relaxed italic">
                          &ldquo;I&apos;ve detected a bottleneck in your layout engine. Should I initialize the auto-refactor sequence?&rdquo;
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3 sm:mt-4 flex gap-3 sm:gap-4 pl-2 flex-wrap">
                      <button className="text-[10px] font-semibold uppercase tracking-widest text-deep-blue border-b-2 border-light-green hover:text-deep-blue-dark transition-all min-h-[44px] sm:min-h-0 flex items-center">Accept Change</button>
                      <button className="text-[10px] font-semibold uppercase tracking-widest text-deep-blue/30 hover:text-deep-blue/60 transition-all min-h-[44px] sm:min-h-0 flex items-center">Discard</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDemo;
