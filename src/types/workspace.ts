
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export type PlanType = 'starter' | 'architect' | 'enterprise';

export interface WorkspacePlan {
  type: PlanType;
  aiTokenLimit: number;
  automationLimit: number;
  memberLimit: number;
  price?: string;
}

export interface WorkspaceMetadata {
  id: string;
  name: string;
  plan: WorkspacePlan;
  memberCount: number;
  aiUsage: {
    tokensUsed: number;
    tokensLimit: number;
  };
  automationUsage: {
    executed: number;
    limit: number;
  };
  subscription: {
    status: string;
    planType: PlanType;
    endsAt?: string;
    trialEndsAt?: string;
  };
  role: UserRole;
  active?: boolean;
}

export interface Permission {
  action: 'manage_automations' | 'generate_reports' | 'access_ai_center' | 'invite_users' | 'billing_access' | 'delete_workspace';
}

export const PLAN_CONFIGS: Record<PlanType, WorkspacePlan> = {
  starter: {
    type: 'starter',
    aiTokenLimit: 10000,
    automationLimit: 5,
    memberLimit: 3,
    price: '$0'
  },
  architect: {
    type: 'architect',
    aiTokenLimit: 100000,
    automationLimit: 50,
    memberLimit: 15,
    price: '$24'
  },
  enterprise: {
    type: 'enterprise',
    aiTokenLimit: 1000000,
    automationLimit: -1, // unlimited
    memberLimit: -1, // unlimited
    price: '$89'
  }
};
