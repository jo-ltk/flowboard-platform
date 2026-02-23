
import React from 'react';
import { UserRole } from '@/types/workspace';
import { getRoleLabel } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { Shield, User, Star, Crown } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export const RoleBadge = ({ role, className }: RoleBadgeProps) => {
  const config = {
    owner: {
      color: "bg-[#2F3A35] text-white border-[#2F3A35]",
      icon: Crown,
    },
    admin: {
      color: "bg-[#f8faf9] text-[#2F3A35] border-[#DDE5E1]",
      icon: Shield,
    },
    member: {
      color: "bg-[#f8faf9] text-[#2F3A35] border-[#DDE5E1]",
      icon: Star,
    },
    viewer: {
      color: "bg-[#f8faf9] text-[#8A9E96] border-[#DDE5E1]",
      icon: User,
    },
  };

  const { color, icon: Icon } = config[role];

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-none text-[9px] font-bold uppercase tracking-[0.2em] border shadow-none",
      color,
      className
    )}>
      <Icon size={10} strokeWidth={3} />
      {getRoleLabel(role)}
    </div>
  );
};
