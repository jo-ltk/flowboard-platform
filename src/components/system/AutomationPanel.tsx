"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Bell, 
  Mail, 
  Archive, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2,
  MoreVertical,
  Activity
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AutomationRule {
  id: string;
  trigger: string;
  actions: string[];
  isActive: boolean;
  frequencyScore: number;
}

const INITIAL_RULES: AutomationRule[] = [
  {
    id: "1",
    trigger: "When task status is 'Completed'",
    actions: ["Notify client via Email", "Generate milestone summary", "Archive after 3 days"],
    isActive: true,
    frequencyScore: 88,
  },
  {
    id: "2",
    trigger: "When deadline is < 24h",
    actions: ["Alert project lead", "Move to 'High Priority'"],
    isActive: true,
    frequencyScore: 42,
  },
  {
    id: "3",
    trigger: "On Monday at 9:00 AM",
    actions: ["Generate weekly sprint report", "Post to Slack channel"],
    isActive: false,
    frequencyScore: 0,
  },
];

export const AutomationPanel = () => {
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [newRule, setNewRule] = useState({ trigger: "", action: "" });
  const [suggestions, setSuggestions] = useState<{trigger: string, action: string}[]>([]);

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const handleAddRule = () => {
    if (!newRule.trigger || !newRule.action) return;
    
    const rule: AutomationRule = {
      id: Math.random().toString(36).substr(2, 9),
      trigger: newRule.trigger,
      actions: [newRule.action],
      isActive: true,
      frequencyScore: Math.floor(Math.random() * 40) + 60,
    };
    
    setRules([...rules, rule]);
    setNewRule({ trigger: "", action: "" });
    setIsModalOpen(false);
  };

  const generateSuggestions = () => {
    setIsSuggesting(true);
    // Simulate AI thinking
    setTimeout(() => {
      setSuggestions([
        { trigger: "When PR remains unreviewed for 24h", action: "Nudge reviewers on Discord" },
        { trigger: "When task is moved to 'Peer Review'", action: "Assign random team member" },
        { trigger: "Every Friday at 4:30 PM", action: "Post 'Week in Review' stats" },
      ]);
      setIsSuggesting(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 p-6 relative">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-syne font-bold text-deep-blue tracking-tight">
            Workflow Automations
          </h2>
          <p className="text-soft-blue text-sm mt-1 font-medium">
            Define intelligent rules to automate your project lifecycle.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-deep-blue text-white rounded-lg hover:bg-deep-blue-dark transition-all duration-300 font-medium shadow-soft"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map((rule) => (
          <motion.div
            key={rule.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 rounded-lg bg-white border border-soft-blue/10 shadow-soft transition-all duration-300 group",
              rule.isActive ? "ring-2 ring-soft-blue/20 bg-cream/30" : "opacity-75 grayscale-[0.5]"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                rule.isActive ? "bg-light-green/40 text-deep-blue" : "bg-soft-blue/10 text-soft-blue"
              )}>
                <Zap className="w-5 h-5" />
              </div>
              <button
                onClick={() => toggleRule(rule.id)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  rule.isActive ? "bg-light-green-dark" : "bg-soft-blue/20"
                )}
              >
                <motion.span
                  animate={{ x: rule.isActive ? 22 : 4 }}
                  className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            <div className="mb-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-soft-blue/60 block mb-1">Trigger</span>
              <p className="font-syne font-bold text-deep-blue leading-tight group-hover:text-deep-blue-light transition-colors">
                {rule.trigger}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-soft-blue/60 block mb-1">Actions</span>
              {rule.actions.map((action, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-deep-blue/80 font-medium bg-soft-blue/5 p-2 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-soft-blue/40" />
                  {action}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-soft-blue/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-soft-blue font-mono">
                <Activity className="w-3.5 h-3.5" />
                <span>{rule.frequencyScore}% effectiveness</span>
              </div>
              {rule.isActive && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-light-green text-deep-blue text-[10px] font-bold">
                  <span className="w-1 h-1 rounded-full bg-deep-blue animate-pulse" />
                  ACTIVE
                </span>
              )}
            </div>
          </motion.div>
        ))}

        {/* Empty Slot / Placeholder */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-soft-blue/20 rounded-lg flex flex-col items-center justify-center p-8 text-soft-blue/40 hover:border-soft-blue/40 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-soft-blue/5 flex items-center justify-center mb-4 group-hover:bg-soft-blue/10 transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-syne font-bold text-deep-blue">Add Custom Rule</span>
          <span className="text-xs mt-1">AI can suggest rules based on your usage</span>
        </button>
      </div>

      {/* AI Simulation / Insight Bar */}
      <div className="mt-12 p-8 rounded-lg bg-linear-to-r from-soft-blue/5 to-light-green/5 border border-soft-blue/10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 text-deep-blue">
            <Brain className="w-5 h-5" />
            <h3 className="font-syne font-bold">AI Workflow Optimization</h3>
          </div>
          <p className="text-soft-blue text-sm">
            FlowBoard AI identified that your "Client Notifications" automation is saving you approximately <span className="text-deep-blue font-bold">4.2 hours</span> per week.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 rounded-xl bg-white shadow-soft text-center">
            <div className="text-2xl font-bold font-syne text-deep-blue">94%</div>
            <div className="text-[10px] font-mono text-soft-blue uppercase tracking-wider">Reliability</div>
          </div>
          <div className="px-6 py-4 rounded-xl bg-white shadow-soft text-center">
            <div className="text-2xl font-bold font-syne text-deep-blue">127</div>
            <div className="text-[10px] font-mono text-soft-blue uppercase tracking-wider">Triggers / mo</div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-blue/40 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl border border-soft-blue/10"
          >
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-syne font-bold text-deep-blue">Create Custom Rule</h3>
                  <p className="text-soft-blue text-sm">Design a new automation or let AI guide you.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-soft-blue/5 flex items-center justify-center text-soft-blue hover:bg-soft-blue/10 transition-colors"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Manual form */}
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-soft-blue/60 block mb-2">When this happens (Trigger)</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-soft-blue/5 border border-soft-blue/10 focus:outline-none focus:ring-2 focus:ring-soft-blue/20 transition-all font-medium text-deep-blue"
                      placeholder="e.g. When task priority is 'High'"
                      value={newRule.trigger}
                      onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-soft-blue/60 block mb-2">Then do this (Action)</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-soft-blue/5 border border-soft-blue/10 focus:outline-none focus:ring-2 focus:ring-soft-blue/20 transition-all font-medium text-deep-blue"
                      placeholder="e.g. Notify manager on Slack"
                      value={newRule.action}
                      onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                    />
                  </div>
                  <button 
                    onClick={handleAddRule}
                    disabled={!newRule.trigger || !newRule.action}
                    className="w-full py-4 bg-deep-blue text-white rounded-xl font-bold hover:bg-deep-blue-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-deep-blue/20"
                  >
                    Create Automation
                  </button>
                </div>

                {/* AI Suggestions column */}
                <div className="bg-soft-blue/5 rounded-2xl p-6 border border-soft-blue/10 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-deep-blue" />
                      <span className="font-syne font-bold text-sm text-deep-blue">AI Suggestions</span>
                    </div>
                    {suggestions.length === 0 && !isSuggesting && (
                      <button 
                        onClick={generateSuggestions}
                        className="text-[10px] font-mono font-bold uppercase text-soft-blue hover:text-deep-blue transition-colors"
                      >
                        Find Patterns
                      </button>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    {isSuggesting ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-3 text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-soft-blue/20 border-t-deep-blue animate-spin" />
                        <p className="text-xs text-soft-blue font-medium">Analyzing workspace behavior...</p>
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((s, i) => (
                        <button 
                          key={i}
                          onClick={() => setNewRule({ trigger: s.trigger, action: s.action })}
                          className="w-full text-left p-3 rounded-xl bg-white border border-soft-blue/10 hover:border-light-green transition-all group"
                        >
                          <div className="text-[10px] font-bold text-light-green-dark mb-1 group-hover:scale-105 transition-transform origin-left">Strategy Suggestion</div>
                          <div className="text-xs font-bold text-deep-blue leading-tight mb-1">{s.trigger}</div>
                          <div className="text-[10px] text-soft-blue truncate">{"→ " + s.action}</div>
                        </button>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <Zap className="w-6 h-6 text-soft-blue/20 mb-2" />
                        <p className="text-[10px] text-soft-blue/60 font-medium">
                          Click "Find Patterns" to let AI analyze your team's workflow and suggest optimizations.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-deep-blue p-4 text-center">
              <p className="text-[10px] font-mono text-cream/40 uppercase tracking-widest">
                FlowBoard Autonomous System v2.0 • Real-time Policy Engine
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Internal icons helper (not exported, just for visuals)
const Brain = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.23 3.487 3.487 0 0 0 6.003 0c.347.161.714.28 1.1.354"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.23 3.487 3.487 0 0 1-6.003 0 4.017 4.017 0 0 1-1.1.354"/>
    <path d="M12 8v11"/>
    <path d="M16 13h1.5"/>
    <path d="M8 13H6.5"/>
  </svg>
);
