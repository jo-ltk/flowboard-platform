
import { WorkspaceMetadata, PLAN_CONFIGS } from '../types/workspace';

const MOCK_WORKSPACES: WorkspaceMetadata[] = [
  {
    id: 'ws-1',
    name: 'Design Studio',
    plan: PLAN_CONFIGS.architect,
    memberCount: 8,
    aiUsage: { tokensUsed: 42500, tokensLimit: 100000 },
    automationUsage: { executed: 12, limit: 50 },
    subscription: { status: 'active', planType: 'architect' },
    role: 'owner',
    active: true,
  },
  {
    id: 'ws-2',
    name: 'Marketing Engine',
    plan: PLAN_CONFIGS.starter,
    memberCount: 2,
    aiUsage: { tokensUsed: 8000, tokensLimit: 10000 },
    automationUsage: { executed: 4, limit: 5 },
    subscription: { status: 'active', planType: 'starter' },
    role: 'admin',
    active: false,
  },
  {
    id: 'ws-3',
    name: 'Global Enterprise',
    plan: PLAN_CONFIGS.enterprise,
    memberCount: 142,
    aiUsage: { tokensUsed: 250000, tokensLimit: 1000000 },
    automationUsage: { executed: 450, limit: -1 },
    subscription: { status: 'active', planType: 'enterprise' },
    role: 'member',
    active: false,
  }
];

export const getWorkspaces = (): WorkspaceMetadata[] => {
  return MOCK_WORKSPACES;
};

export const getActiveWorkspace = (): WorkspaceMetadata => {
  return MOCK_WORKSPACES.find(ws => ws.active) || MOCK_WORKSPACES[0];
};

export const createWorkspace = (name: string): WorkspaceMetadata => {
  const newWs: WorkspaceMetadata = {
    id: `ws-${Math.random().toString(36).substr(2, 9)}`,
    name,
    plan: PLAN_CONFIGS.starter,
    memberCount: 1,
    aiUsage: { tokensUsed: 0, tokensLimit: 10000 },
    automationUsage: { executed: 0, limit: 5 },
    subscription: { status: 'active', planType: 'starter' },
    role: 'owner',
    active: false,
  };
  // In a real app, this would be saved to a database
  return newWs;
};
