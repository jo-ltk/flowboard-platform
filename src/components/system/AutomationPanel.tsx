
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Plus, 
  Activity,
  Trash2,
  Loader2,
  X,
  Brain
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useWorkspaces } from "@/context/WorkspaceContext";
import { toast } from "sonner";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AutomationRule {
  id: string;
  name?: string;
  trigger: string;
  action: string;
  isActive: boolean;
  workspaceId: string;
}

export const AutomationPanel = () => {
  const { activeWorkspace } = useWorkspaces();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [newRule, setNewRule] = useState({ trigger: "", action: "" });
  const [suggestions, setSuggestions] = useState<{trigger: string, action: string}[]>([]);

  useEffect(() => {
    if (activeWorkspace?.id) {
        fetchRules();
    }
  }, [activeWorkspace?.id]);

  const fetchRules = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/workflows?workspaceId=${activeWorkspace?.id}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setRules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRule = async (id: string, currentStatus: boolean) => {
    try {
      await fetch('/api/workflows', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });
      setRules(rules.map(r => r.id === id ? { ...r, isActive: !currentStatus } : r));
      toast.success(currentStatus ? "Automation paused" : "Automation resumed");
    } catch (err) {
      toast.error("Failed to toggle rule");
    }
  };

  const handleAddRule = async () => {
    if (!newRule.trigger || !newRule.action) return;
    
    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger: newRule.trigger,
          action: newRule.action,
          workspaceId: activeWorkspace?.id
        })
      });
      const data = await res.json();
      setRules([data, ...rules]);
      setNewRule({ trigger: "", action: "" });
      setIsModalOpen(false);
      toast.success("Workflow deployed successfully");
    } catch (err) {
      toast.error("Failed to deploy workflow");
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
        const res = await fetch(`/api/workflows?id=${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        setRules(rules.filter(r => r.id !== id));
        toast.success("Workflow decommissioned");
    } catch (err) {
        toast.error("Failed to delete");
    }
  }

  const generateSuggestions = () => {
    setIsSuggesting(true);
    setTimeout(() => {
      setSuggestions([
        { trigger: "When task is completed", action: "Add system comment: 'Goal achieved!'" },
        { trigger: "When task is started", action: "Add system comment: 'Operation initialized.'" },
        { trigger: "When new task is created", action: "Add system comment: 'Awaiting architecture review.'" },
      ]);
      setIsSuggesting(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 p-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-syne font-bold text-sage-deep tracking-tight">
            Workflow Automations
          </h2>
          <p className="text-soft-blue text-sm mt-1 font-medium">
            Define intelligent rules for {activeWorkspace?.name || 'this workspace'}.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-sage-deep text-white rounded-xl hover:bg-sage-deep-dark transition-all duration-300 font-bold shadow-lg shadow-sage-deep/10 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-soft-blue/40">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="font-mono text-[10px] uppercase tracking-widest font-bold">Synchronizing Policy Engine...</p>
            </div>
        ) : rules.length === 0 ? (
            <div className="col-span-full py-20 border-2 border-dashed border-soft-blue/10 rounded-[32px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-soft-blue/5 rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-soft-blue/20" />
                </div>
                <h3 className="font-syne font-bold text-sage-deep text-lg">No active workflows</h3>
                <p className="text-soft-blue text-sm max-w-xs mt-1">Start by adding your first automation rule or let AI suggest patterns.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 px-6 py-3 bg-soft-blue/10 text-sage-deep rounded-xl font-bold text-sm hover:bg-soft-blue/20 transition-all"
                >
                    Create Custom Rule
                </button>
            </div>
        ) : rules.map((rule) => (
          <motion.div
            key={rule.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 rounded-xl bg-white border border-soft-blue/10 shadow-soft transition-all duration-300 group",
              rule.isActive ? "ring-2 ring-soft-blue/20 bg-cream/30" : "opacity-75 grayscale-[0.5]"
            )}
          >
            <div className="flex items-start justify-between mb-6">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                rule.isActive ? "bg-light-green/40 text-sage-deep" : "bg-soft-blue/10 text-soft-blue"
              )}>
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRule(rule.id, rule.isActive)}
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
                  <button 
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 text-soft-blue/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-soft-blue/60 block mb-1">Trigger</span>
              <p className="font-syne font-bold text-sage-deep leading-tight text-lg">
                {rule.trigger}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-soft-blue/60 block mb-1">Action</span>
              <div className="flex items-center gap-3 text-sm text-sage-deep/80 font-bold bg-white border border-soft-blue/5 p-3 rounded-xl shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-light-green-dark" />
                {rule.action}
              </div>
            </div>

            <div className="pt-4 border-t border-soft-blue/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-soft-blue font-mono font-bold">
                <Activity className="w-3.5 h-3.5" />
                <span>OPS_READY</span>
              </div>
              {rule.isActive && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-light-green text-sage-deep text-[9px] font-black tracking-widest uppercase">
                  <span className="w-1 h-1 rounded-full bg-sage-deep animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-deep/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border border-soft-blue/10"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-syne font-bold text-sage-deep">Architect Workflow</h3>
                    <p className="text-soft-blue text-sm mt-1">Design a core operational automation pattern.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-12 h-12 rounded-full bg-soft-blue/5 flex items-center justify-center text-soft-blue hover:bg-soft-blue/10 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-soft-blue/60 block mb-2">Initialize Trigger</label>
                      <input 
                        type="text"
                        className="w-full px-5 py-4  bg-soft-blue/5 border border-soft-blue/10 focus:outline-none focus:ring-2 focus:ring-soft-blue/20 transition-all font-bold text-sage-deep placeholder:text-sage-deep/20"
                        placeholder="e.g. Task completed"
                        value={newRule.trigger}
                        onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-soft-blue/60 block mb-2">Execute Action</label>
                      <input 
                        type="text"
                        className="w-full px-5 py-4  bg-soft-blue/5 border border-soft-blue/10 focus:outline-none focus:ring-2 focus:ring-soft-blue/20 transition-all font-bold text-sage-deep placeholder:text-sage-deep/20"
                        placeholder="e.g. Notify project lead"
                        value={newRule.action}
                        onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                      />
                    </div>
                    <button 
                      onClick={handleAddRule}
                      disabled={!newRule.trigger || !newRule.action}
                      className="w-full py-5 bg-sage-deep text-white  font-black uppercase tracking-[0.2em] text-[11px] hover:bg-sage-deep-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-sage-deep/20"
                    >
                      Deploy Automation
                    </button>
                  </div>

                  <div className="bg-soft-blue/5 rounded-[32px] p-8 border border-soft-blue/10 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-sage-deep" />
                        <span className="font-syne font-bold text-sage-deep">AI Synthesis</span>
                      </div>
                      {suggestions.length === 0 && !isSuggesting && (
                        <button 
                          onClick={generateSuggestions}
                          className="text-[10px] font-mono font-bold uppercase text-sage-deep border-b border-sage-deep hover:text-soft-blue hover:border-soft-blue transition-colors"
                        >
                          Synthesize
                        </button>
                      )}
                    </div>

                    <div className="flex-1 space-y-4">
                      {isSuggesting ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                          <Loader2 className="w-8 h-8 text-sage-deep animate-spin" />
                          <p className="text-xs text-soft-blue font-bold font-mono uppercase tracking-widest">Neural Mapping...</p>
                        </div>
                      ) : suggestions.length > 0 ? (
                        suggestions.map((s, i) => (
                          <button 
                            key={i}
                            onClick={() => setNewRule({ trigger: s.trigger, action: s.action })}
                            className="w-full text-left p-4  bg-white border border-soft-blue/10 hover:border-light-green transition-all group relative overflow-hidden"
                          >
                            <div className="text-[9px] font-black text-light-green-dark mb-1 uppercase tracking-widest">Strategy_Pattern</div>
                            <div className="text-xs font-bold text-sage-deep leading-tight mb-1">{s.trigger}</div>
                            <div className="text-[10px] text-soft-blue font-medium italic">{"→ " + s.action}</div>
                          </button>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                          <Zap className="w-8 h-8 text-soft-blue/10 mb-2" />
                          <p className="text-[10px] text-soft-blue font-bold uppercase tracking-widest leading-relaxed">
                            Initialize Neural Pattern recognition to extract workflows.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
