"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkspaceMetadata } from '@/types/workspace';
import { getWorkspaces, getActiveWorkspace } from '@/lib/workspace-engine';
import { toast } from 'sonner';

interface WorkspaceContextType {
  workspaces: WorkspaceMetadata[];
  activeWorkspace: WorkspaceMetadata;
  setActiveWorkspace: (workspace: WorkspaceMetadata) => void;
  createWorkspace: (name: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  refreshWorkspaces: () => Promise<WorkspaceMetadata[] | undefined>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceMetadata[]>([]);
  const [activeWorkspace, setActiveWorkspaceState] = useState<WorkspaceMetadata | null>(null);

  const refreshWorkspaces = async () => {
    try {
      const res = await fetch('/api/workspaces');
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped: WorkspaceMetadata[] = data.map((ws: any) => ({
          id: ws.id,
          name: ws.name,
          slug: ws.slug,
          plan: { 
            type: ws.planType || 'starter',
            aiTokenLimit: 1000000,
            automationLimit: 50,
            memberLimit: 10
          },
          memberCount: ws._count?.memberships || 2,
          role: 'owner',
          active: false,
          aiUsage: ws.aiTokenUsage || 0,
          automationUsage: ws.automationUsage || 0,
          subscription: {
              status: ws.subscriptionStatus || 'trialing',
              planType: ws.planType || 'starter',
              endsAt: ws.subscriptionEndsAt || undefined
          }
        }));
        setWorkspaces(mapped);
        return mapped;
      }
    } catch (err) {
      console.error('Failed to refresh workspaces:', err);
    }
  };

  useEffect(() => {
    const initWorkspaces = async () => {
      const mapped = await refreshWorkspaces();
      if (mapped && mapped.length > 0) {
        const savedId = localStorage.getItem('activeWorkspaceId');
        const found = mapped.find((w: any) => w.id === savedId) || mapped[0];
        if (found) {
          setActiveWorkspaceState(found);
        }
      }
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

  if (!activeWorkspace) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-cream">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-sage-deep border-t-light-green rounded-full animate-spin" />
                <p className="font-syne font-bold text-sage-deep/40 uppercase tracking-widest text-xs">Architecting Core Systems...</p>
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
      refreshWorkspaces 
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
