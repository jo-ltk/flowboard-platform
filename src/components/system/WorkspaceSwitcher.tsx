
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
    <div className="relative w-full px-4 mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-2 rounded-[32px] transition-all duration-500",
          "bg-white border border-soft-blue/10 shadow-lg shadow-deep-blue/5 hover:shadow-xl",
          isOpen ? "ring-2 ring-light-green/20" : ""
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-soft-blue/10 flex items-center justify-center text-deep-blue">
            <LayoutGrid size={18} strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-bold text-deep-blue/40 uppercase tracking-[0.2em] leading-tight">Workspace</p>
            <p className="text-[15px] font-bold text-deep-blue tracking-tight">
              {activeWorkspace.name}
            </p>
          </div>
        </div>
        <ChevronDown 
          size={18} 
          className={cn("text-deep-blue/30 transition-transform duration-500 mr-2", isOpen && "rotate-180")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute left-0 right-0 top-full mt-3 z-50 bg-white border border-soft-blue/10 rounded-[28px] shadow-2xl overflow-hidden p-2"
            >
              <div className="space-y-1">
                <p className="px-4 py-3 text-[10px] font-bold text-deep-blue/30 uppercase tracking-[0.2em]">
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
                        "w-full flex items-center justify-between p-3.5 rounded-[20px] transition-all duration-300 group cursor-pointer outline-none",
                        activeWorkspace.id === ws.id 
                          ? "bg-soft-blue/5 text-deep-blue" 
                          : "hover:bg-soft-blue/5 text-deep-blue/60 hover:text-deep-blue"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {activeWorkspace.id === ws.id ? (
                          <div className="relative flex items-center justify-center">
                            <div className="absolute w-5 h-5 rounded-full bg-light-green/30 animate-pulse" />
                            <div className="w-2.5 h-2.5 rounded-full bg-light-green ring-2 ring-white z-10" />
                          </div>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-deep-blue/10 border border-deep-blue/5" />
                        )}
                        
                        <div className="text-left">
                          <p className="text-sm font-bold tracking-tight leading-tight">{ws.name}</p>
                          <p className="text-[10px] font-medium text-deep-blue/40 mt-0.5">
                            {ws.memberCount} members • {ws.plan.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeWorkspace.id === ws.id && (
                          <Check size={16} className="text-light-green-dark stroke-[3px]" />
                        )}
                        {workspaces.length > 1 && (
                            <button 
                                onClick={(e) => handleDelete(e, ws.id)}
                                className="p-2 rounded-lg hover:bg-red-50 text-deep-blue/10 hover:text-red-500 transition-all opacity-0 group-hover/item:opacity-100 z-10"
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
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-[20px] text-deep-blue/60 hover:text-deep-blue hover:bg-soft-blue/5 transition-all text-xs font-bold"
                >
                  <Plus size={18} strokeWidth={2.5} className="text-deep-blue/40" />
                  <span>Create Workspace</span>
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
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-deep-blue/40 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-soft-blue/10"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-syne font-bold text-deep-blue">New Workspace</h3>
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
                                className="w-full px-5 py-4 rounded-2xl bg-soft-blue/5 border border-soft-blue/10 focus:outline-none focus:ring-2 focus:ring-soft-blue/20 transition-all font-bold text-deep-blue placeholder:text-deep-blue/20"
                                placeholder="E.G. TITAN OPERATIONS"
                                value={newWsName}
                                onChange={(e) => setNewWsName(e.target.value.toUpperCase())}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={!newWsName.trim() || isSubmitting}
                            className="w-full py-4 bg-deep-blue text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-deep-blue-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-deep-blue/20 flex items-center justify-center gap-2"
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
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-deep-blue/40 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-[32px] w-full max-w-sm p-8 shadow-2xl border border-soft-blue/10 text-center"
                >
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trash2 size={32} className="text-red-500" />
                    </div>
                    
                    <h3 className="text-xl font-syne font-bold text-deep-blue mb-2">Delete Workspace?</h3>
                    <p className="text-soft-blue text-sm mb-8 leading-relaxed">
                        This operation is irreversible. All projects, tasks, and data within <strong>{workspaces.find(w => w.id === isDeleting)?.name}</strong> will be permanently purged.
                    </p>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsDeleting(null)}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 bg-soft-blue/5 text-deep-blue rounded-2xl font-bold text-sm hover:bg-soft-blue/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmDelete}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
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
