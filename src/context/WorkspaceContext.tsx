"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkspaceMetadata, PLAN_CONFIGS, PlanType } from '@/types/workspace';
import { getWorkspaces, getActiveWorkspace } from '@/lib/workspace-engine';
import { toast } from 'sonner';

interface WorkspaceContextType {
  workspaces: WorkspaceMetadata[];
  activeWorkspace: WorkspaceMetadata | null;
  setActiveWorkspace: (workspace: WorkspaceMetadata) => void;
  createWorkspace: (name: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  refreshWorkspaces: () => Promise<WorkspaceMetadata[] | undefined>;
  isLoading: boolean;
  error: string | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceMetadata[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<WorkspaceMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshWorkspaces = async () => {
    try {
      setError(null);
      const res = await fetch('/api/workspaces');
      if (!res.ok) {
        throw new Error(`Failed to fetch workspaces: ${res.statusText}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped: WorkspaceMetadata[] = data.map((ws: any) => {
          const planConfig = PLAN_CONFIGS[(ws.planType || 'starter') as PlanType] || PLAN_CONFIGS.starter;
          return {
            id: ws.id,
            name: ws.name,
            slug: ws.slug,
            plan: planConfig,
            memberCount: ws._count?.memberships || 2,
            role: 'owner',
            active: false,
            aiUsage: {
              tokensUsed: ws.aiTokenUsage || 0,
              tokensLimit: planConfig.aiTokenLimit
            },
            automationUsage: {
              executed: ws.automationUsage || 0,
              limit: planConfig.automationLimit
            },
            subscription: {
                status: ws.subscriptionStatus || 'trialing',
                planType: (ws.planType || 'starter') as PlanType,
                endsAt: ws.subscriptionEndsAt || undefined
            }
          };
        });
        setWorkspaces(mapped);
        // Cache the workspaces
        if (typeof window !== 'undefined') {
          localStorage.setItem('cached_workspaces', JSON.stringify(mapped));
        }
        return mapped;
      }
      return [];
    } catch (err: any) {
      console.error('Failed to refresh workspaces:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('Could not connect to the workspace engine');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initWorkspaces = async () => {
      // 1. Try to load from cache first for instant UI
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('cached_workspaces');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setWorkspaces(parsed);
              const savedId = localStorage.getItem('activeWorkspaceId');
              const found = parsed.find((w: any) => w.id === savedId) || parsed[0];
              if (found) {
                setActiveWorkspaceState(found);
                setIsLoading(false); // Stop loading early if we have cache
              }
            }
          } catch (e) {
            console.error('Error parsing cached workspaces', e);
          }
        }
      }

      // 2. Fetch fresh data in the background (or foreground if no cache)
      const mapped = await refreshWorkspaces();
      
      if (mapped && mapped.length > 0) {
        const savedId = typeof window !== 'undefined' ? localStorage.getItem('activeWorkspaceId') : null;
        const found = mapped.find((w: any) => w.id === savedId) || mapped[0];
        if (found) {
          setActiveWorkspaceState(found);
        }
      } else if (mapped && mapped.length === 0) {
        setError('No workspaces found. Please create one.');
      }
      setIsLoading(false);
    };
    initWorkspaces();
  }, []);

  const setActiveWorkspace = (workspace: WorkspaceMetadata) => {
    console.log('[WorkspaceContext] Setting active workspace (forced re-render):', workspace.name);
    toast.success(`Switched to ${workspace.name}`);
    setActiveWorkspaceState({ ...workspace });
    localStorage.setItem('activeWorkspaceId', workspace.id);
  };

  const createWorkspace = async (name: string) => {
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!res.ok) throw new Error("Failed to create workspace");
      const newWs = await res.json();
      const updated = await refreshWorkspaces();
      if (updated) {
        const found = updated.find(w => w.id === newWs.id);
        if (found) setActiveWorkspace(found);
      }
    } catch (err) {
      toast.error("Failed to create workspace");
      console.error(err);
    }
  };

  const deleteWorkspace = async (id: string) => {
    try {
      const res = await fetch(`/api/workspaces?id=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }
      toast.success("Workspace deleted");
      const updated = await refreshWorkspaces();
      if (updated && activeWorkspace?.id === id) {
        setActiveWorkspace(updated[0]);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (activeWorkspace) {
      console.log('[WorkspaceContext] Current active workspace:', activeWorkspace.name);
      if (typeof window !== 'undefined') {
        (window as any).activeWorkspace = activeWorkspace;
      }
    }
  }, [activeWorkspace]);

  if (isLoading || (!activeWorkspace && !error)) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-cream">
            <div className="flex flex-col items-center gap-6 max-w-sm text-center px-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-sage-deep/10 border-t-sage-deep rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-sage-deep rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-syne font-bold text-sage-deep uppercase tracking-widest text-[10px] opacity-60">System Initializing</p>
                  <p className="text-sage-deep/40 text-sm italic font-instrument">"Architecting Core Systems..."</p>
                </div>
            </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream px-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-sage-deep/10 text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h2 className="font-syne font-bold text-xl text-sage-deep mb-2">Architectural Fault</h2>
          <p className="text-sage-deep/60 mb-6 text-sm leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-sage-deep text-cream rounded-xl font-syne font-bold hover:bg-sage-deep/90 transition-all shadow-lg"
          >
            Retry Initialization
          </button>
        </div>
      </div>
    );
  }

  return (
    <WorkspaceContext.Provider value={{ 
      workspaces, 
      activeWorkspace, 
      setActiveWorkspace, 
      createWorkspace, 
      deleteWorkspace, 
      refreshWorkspaces,
      isLoading,
      error
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaces = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaces must be used within a WorkspaceProvider');
  }
  return context;
};
