"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Layout, CheckCircle, Brain, Settings, ArrowRight, CornerDownLeft } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CommandItem {
  id: string;
  title: string;
  category: "Projects" | "Tasks" | "AI" | "Settings";
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

const COMMANDS: CommandItem[] = [
  { id: "1", title: "Reschedule tasks due this week", category: "AI", icon: <Brain className="w-4 h-4" />, action: () => console.log("AI: Rescheduling...") },
  { id: "2", title: "Summarize client project", category: "AI", icon: <Brain className="w-4 h-4" />, action: () => console.log("AI: Summarizing...") },
  { id: "3", title: "Create sprint plan", category: "AI", icon: <Brain className="w-4 h-4" />, action: () => console.log("AI: Creating plan...") },
  { id: "4", title: "View all projects", category: "Projects", icon: <Layout className="w-4 h-4" />, action: () => console.log("Navigating to Projects") },
  { id: "5", title: "New Task", category: "Tasks", icon: <CheckCircle className="w-4 h-4" />, shortcut: "N", action: () => console.log("Creating Task") },
  { id: "6", title: "Workflow Settings", category: "Settings", icon: <Settings className="w-4 h-4" />, action: () => console.log("Opening Settings") },
];

import { simulateAIAnalysis, MockTask } from "@/lib/ai-simulation";

const MOCK_TASKS: MockTask[] = [
  { id: "1", title: "Client Presentation", dueDate: new Date(Date.now() - 86400000), priority: "high", status: "todo", estimatedHours: 4 },
  { id: "2", title: "Backend Fixes", dueDate: new Date(Date.now() + 86400000), priority: "medium", status: "in-progress", estimatedHours: 6 },
  { id: "3", title: "Design System Update", dueDate: new Date(Date.now() + 172800000), priority: "low", status: "todo", estimatedHours: 8 },
];

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAiAnalysis(simulateAIAnalysis(MOCK_TASKS));
  }, []);

  const filteredCommands = query === "" 
    ? COMMANDS 
    : COMMANDS.filter((cmd) => cmd.title.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length + (aiAnalysis?.recommendations.length || 0)));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + (filteredCommands.length + (aiAnalysis?.recommendations.length || 0))) % (filteredCommands.length + (aiAnalysis?.recommendations.length || 0)));
    } else if (e.key === "Enter") {
      // Logic for selecting AI rec or normal command
      if (selectedIndex < filteredCommands.length) {
        filteredCommands[selectedIndex]?.action();
      } else {
        console.log("AI Recommendation applied");
      }
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-sage-deep/10 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-cream border border-soft-blue/30  shadow-elevated overflow-hidden ring-1 ring-sage-deep/5"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center px-6 py-5 border-b border-soft-blue/10">
              <Search className="w-5 h-5 text-soft-blue mr-3" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="Type a command or ask AI..."
                className="w-full bg-transparent border-none outline-none text-sage-deep text-lg font-syne font-bold placeholder:text-soft-blue/50 placeholder:font-medium"
              />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-soft-blue/10 border border-soft-blue/20">
                <Command className="w-3 h-3 text-soft-blue" />
                <span className="text-[10px] font-bold text-soft-blue">K</span>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto py-4 custom-scrollbar">
              {/* AI Insights Section (Sticky-style if relevant) */}
              {query === "" && aiAnalysis && aiAnalysis.recommendations.length > 0 && (
                <div className="px-3 mb-6">
                  <h3 className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-sage-deep/40 font-mono mb-2">
                    AI Strategic Recommendations
                  </h3>
                  <div className="space-y-2">
                    {aiAnalysis.recommendations.map((rec: any, idx: number) => {
                      const itemIdx = filteredCommands.length + idx;
                      const isActive = selectedIndex === itemIdx;
                      return (
                        <div 
                          key={rec.id}
                          onMouseEnter={() => setSelectedIndex(itemIdx)}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer border",
                            isActive 
                              ? "bg-light-green border-sage-deep/10 shadow-medium translate-x-1" 
                              : "bg-surface-tinted border-transparent grayscale-[0.3]"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-white shadow-soft">
                              <Brain className="w-5 h-5 text-sage-deep" />
                            </div>
                            <div>
                              <p className="text-sm font-syne font-bold text-sage-deep">{rec.action}</p>
                              <p className="text-[11px] text-sage-deep/60 font-medium">{rec.reason}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-[10px] font-mono font-bold text-sage-deep/40 block uppercase">Impact</span>
                              <span className="text-xs font-bold text-sage-deep">+{rec.impactScore}</span>
                            </div>
                            {isActive && <ArrowRight className="w-4 h-4 text-sage-deep" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredCommands.length === 0 && (!aiAnalysis || aiAnalysis.recommendations.length === 0) ? (
                <div className="px-6 py-12 text-center text-soft-blue/70 italic">
                  No commands found matching "{query}"
                </div>
              ) : (
                <div className="space-y-6">
                  {["AI", "Projects", "Tasks", "Settings"].map((category) => {
                    const categoryCmds = filteredCommands.filter(c => c.category === category);
                    if (categoryCmds.length === 0) return null;

                    return (
                      <div key={category} className="px-3">
                        <h3 className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-soft-blue/60 font-mono">
                          {category}
                        </h3>
                        <div className="space-y-1">
                          {categoryCmds.map((cmd) => {
                            const index = filteredCommands.indexOf(cmd);
                            const isActive = index === selectedIndex;

                            return (
                              <button
                                key={cmd.id}
                                onClick={() => {
                                  cmd.action();
                                  setIsOpen(false);
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={cn(
                                  "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 text-left",
                                  isActive 
                                    ? "bg-soft-blue/20 translate-x-1" 
                                    : "bg-transparent"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isActive ? "bg-white text-sage-deep shadow-soft" : "bg-soft-blue/10 text-soft-blue"
                                  )}>
                                    {cmd.icon}
                                  </div>
                                  <span className={cn(
                                    "font-syne font-bold transition-colors",
                                    isActive ? "text-sage-deep" : "text-sage-deep/60"
                                  )}>
                                    {cmd.title}
                                  </span>
                                </div>
                                {cmd.shortcut && (
                                  <div className="px-2 py-0.5 rounded border border-soft-blue/20 bg-white text-[10px] font-mono text-soft-blue">
                                    {cmd.shortcut}
                                  </div>
                                )}
                                {isActive && !cmd.shortcut && (
                                  <CornerDownLeft className="w-3 h-3 text-sage-deep/30" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-cream-cool border-t border-soft-blue/10 flex items-center justify-between text-[11px] text-soft-blue font-mono font-medium">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 rounded border border-soft-blue/30 bg-white shadow-sm font-sans">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 rounded border border-soft-blue/30 bg-white shadow-sm font-sans">Enter</kbd>
                  Execute
                </span>
              </div>
              {aiAnalysis && (
                <div className="flex items-center gap-3 text-sage-deep">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-light-green-dark" />
                    <span className="font-bold uppercase tracking-tight">Focus Score: {aiAnalysis.productivityScore}%</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
