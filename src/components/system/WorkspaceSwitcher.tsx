
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Plus, 
  Check, 
  LayoutGrid, 
  Settings, 
  ShieldCheck,
  Zap,
  Trash2,
  X,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspaces } from '@/context/WorkspaceContext';
import { WorkspaceMetadata } from '@/types/workspace';

export const WorkspaceSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const { workspaces, activeWorkspace, setActiveWorkspace, createWorkspace, deleteWorkspace } = useWorkspaces();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await createWorkspace(newWsName);
      setNewWsName("");
      setIsCreating(false);
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsDeleting(id);
  };

  const confirmDelete = async () => {
    if (!isDeleting || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await deleteWorkspace(isDeleting);
      setIsDeleting(null);
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="relative w-full mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-none transition-all duration-500",
          "bg-white border border-[#DDE5E1] hover:border-[#2F3A35]",
          isOpen ? "bg-[#f8faf9]" : ""
        )}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-none bg-[#2F3A35] flex items-center justify-center text-white">
            <LayoutGrid size={18} strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-bold text-[#8A9E96] uppercase tracking-[0.2em] leading-tight">Workspace</p>
            <p className="text-[14px] font-black text-[#2F3A35] uppercase tracking-tight">
              {activeWorkspace?.name || "Select Workspace"}
            </p>
          </div>
        </div>
        <ChevronDown 
          size={18} 
          className={cn("text-[#2F3A35]/30 transition-transform duration-500 mr-2", isOpen && "rotate-180")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-[#DDE5E1] rounded-none shadow-2xl p-2"
            >
              <div className="space-y-1">
                <p className="px-4 py-3 text-[10px] font-bold text-sage-deep/30 uppercase tracking-[0.2em]">
                  Your Workspaces
                </p>
                
                {workspaces.map((ws) => (
                  <div key={ws.id} className="relative group/item">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setActiveWorkspace(ws);
                        setIsOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setActiveWorkspace(ws);
                          setIsOpen(false);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-none transition-all duration-300 group cursor-pointer outline-none",
                        activeWorkspace?.id === ws.id 
                          ? "bg-[#2F3A35] text-white" 
                          : "hover:bg-[#f8faf9] text-[#2F3A35] border border-transparent hover:border-[#DDE5E1]"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {activeWorkspace?.id === ws.id ? (
                          <div className="w-1 h-8 bg-[#8CBA41]" />
                        ) : (
                          <div className="w-1 h-8 bg-transparent" />
                        )}
                        
                        <div className="text-left">
                          <p className="text-[13px] font-bold uppercase tracking-wider leading-tight">{ws.name}</p>
                          <p className={cn(
                            "text-[9px] font-bold uppercase tracking-widest mt-1",
                            activeWorkspace?.id === ws.id ? "text-white/60" : "text-[#8A9E96]"
                          )}>
                            {ws.memberCount} MEMBERS • {ws.plan.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeWorkspace?.id === ws.id && (
                          <Check size={16} className="text-light-green-dark stroke-[3px]" />
                        )}
                        {workspaces.length > 1 && (
                            <button 
                                onClick={(e) => handleDelete(e, ws.id)}
                                className="p-2 rounded-lg hover:bg-red-50 text-sage-deep/10 hover:text-red-500 transition-all opacity-0 group-hover/item:opacity-100 z-10"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-1 pt-1 border-t border-soft-blue/5">
                <button 
                  onClick={() => setIsCreating(true)}
                  className="w-full flex items-center justify-center gap-4 px-4 py-5 rounded-none text-[#2F3A35] hover:bg-[#2F3A35] hover:text-white transition-all text-[11px] font-bold uppercase tracking-[0.2em] border border-dashed border-[#DDE5E1] mt-2"
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>Deploy Hub</span>
                </button>
              </div>

              {/* Decorative accent */}
              <div className="h-1.5 w-1/3 bg-light-green/20 mx-auto rounded-full mb-1 opacity-50" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCreating && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sage-deep/40 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-soft-blue/10"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-syne font-bold text-sage-deep">New Workspace</h3>
                            <p className="text-soft-blue text-sm">Deploy a new operational hub.</p>
                        </div>
                        <button 
                            onClick={() => setIsCreating(false)}
                            className="w-10 h-10 rounded-full bg-soft-blue/5 flex items-center justify-center text-soft-blue hover:bg-soft-blue/10 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-soft-blue/60 block mb-2">Workspace Name</label>
                            <input 
                                autoFocus
                                readOnly={isSubmitting}
                                type="text"
                                className="w-full px-5 py-4  bg-soft-blue/5 border border-soft-blue/10 focus:outline-none focus:ring-2 focus:ring-soft-blue/20 transition-all font-bold text-sage-deep placeholder:text-sage-deep/20"
                                placeholder="E.G. TITAN OPERATIONS"
                                value={newWsName}
                                onChange={(e) => setNewWsName(e.target.value.toUpperCase())}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={!newWsName.trim() || isSubmitting}
                            className="w-full py-4 bg-sage-deep text-white  font-black uppercase tracking-[0.2em] text-[11px] hover:bg-sage-deep-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sage-deep/20 flex items-center justify-center gap-2"
                        >
                            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                            <span>{isSubmitting ? "Initializing..." : "Initialize Workspace"}</span>
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDeleting && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sage-deep/40 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl border border-soft-blue/10 text-center"
                >
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trash2 size={32} className="text-red-500" />
                    </div>
                    
                    <h3 className="text-xl font-syne font-bold text-sage-deep mb-2">Delete Workspace?</h3>
                    <p className="text-soft-blue text-sm mb-8 leading-relaxed">
                        This operation is irreversible. All projects, tasks, and data within <strong>{workspaces.find(w => w.id === isDeleting)?.name}</strong> will be permanently purged.
                    </p>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsDeleting(null)}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 bg-soft-blue/5 text-sage-deep  font-bold text-sm hover:bg-soft-blue/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmDelete}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 bg-red-500 text-white  font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                            <span>{isSubmitting ? "Deleting..." : "Purge Data"}</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};
