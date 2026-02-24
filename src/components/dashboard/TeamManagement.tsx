"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  ChevronDown,
  Loader2,
  Shield,
  ShieldCheck,
  UserCircle,
  Eye,
  MoreVertical,
  Trash2,
  Mail,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { useWorkspaces } from "@/context/WorkspaceContext";

interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  role: "OWNER" | "ADMIN" | "MEMBER" | "GUEST";
}

const ROLE_CONFIG = {
  OWNER: {
    label: "Owner",
    icon: ShieldCheck,
    color: "bg-[#2F3A35] text-white",
    description: "Full access · Cannot be removed",
  },
  ADMIN: {
    label: "Admin",
    icon: Shield,
    color: "bg-[#7C9A8B] text-white",
    description: "Can manage team & settings",
  },
  MEMBER: {
    label: "Member",
    icon: UserCircle,
    color: "bg-[#AFC8B8] text-[#2F3A35]",
    description: "Can create & manage tasks",
  },
  GUEST: {
    label: "Guest",
    icon: Eye,
    color: "bg-[#E9EFEC] text-[#5C6B64]",
    description: "View-only access",
  },
};

export function TeamManagement() {
  const { activeWorkspace } = useWorkspaces();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  useEffect(() => {
    if (activeWorkspace?.id) {
      fetchMembers();
    }
  }, [activeWorkspace?.id]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/team?workspaceId=${activeWorkspace.id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (Array.isArray(data)) setMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (data: { email: string; name: string; role: string }) => {
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: activeWorkspace.id,
          ...data,
        }),
      });

      if (res.status === 409) {
        toast.error("This person is already a team member");
        return;
      }

      if (!res.ok) throw new Error("Failed to add");

      toast.success(`${data.name || data.email} added to the team`);
      fetchMembers();
      setShowAddModal(false);
    } catch (error) {
      toast.error("Failed to add team member");
    }
  };

  const handleRoleChange = async (membershipId: string, newRole: string) => {
    try {
      const res = await fetch("/api/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId, role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update");
      toast.success("Role updated");
      fetchMembers();
      setEditingRoleId(null);
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleRemoveMember = async (membershipId: string, name: string) => {
    if (!confirm(`Remove ${name} from the team?`)) return;

    try {
      const res = await fetch(`/api/team?id=${membershipId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove");
      toast.success(`${name} removed from the team`);
      setMembers((prev) => prev.filter((m) => m.id !== membershipId));
    } catch (error) {
      toast.error("Failed to remove team member");
    }
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-8 h-8 text-[#7C9A8B] animate-spin" />
        <p className="text-[10px] font-bold text-[#8A9E96] uppercase tracking-[0.2em]">
          Loading team...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["OWNER", "ADMIN", "MEMBER", "GUEST"] as const).map((role) => {
          const config = ROLE_CONFIG[role];
          const count = members.filter((m) => m.role === role).length;
          const Icon = config.icon;
          return (
            <div
              key={role}
              className="bg-white border border-[#DDE5E1] p-5 hover:border-[#AFC8B8] transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("p-2 rounded-lg", config.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9E96]">
                  {config.label}s
                </span>
              </div>
              <span className="text-3xl font-bold text-[#2F3A35]">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Search & Add Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-6 border-b border-[#DDE5E1]">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AFC8B8] group-focus-within:text-[#7C9A8B] transition-colors" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 h-11 rounded-xl bg-white border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 transition-all outline-hidden text-sm font-medium placeholder:text-[#AFC8B8] placeholder:font-light"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-11 px-6 rounded-xl bg-[#7C9A8B] text-white hover:bg-[#5F7D6E] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer group"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Add Person</span>
        </button>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => {
            const roleConfig = ROLE_CONFIG[member.role];
            const RoleIcon = roleConfig.icon;

            return (
              <div
                key={member.id}
                className="group bg-white border border-[#DDE5E1] p-5 hover:border-[#AFC8B8] hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 flex-1">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#DDE5E1]"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#E9EFEC] border-2 border-[#DDE5E1] flex items-center justify-center text-sm font-bold text-[#7C9A8B]">
                      {getInitials(member.name)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#2F3A35] truncate">
                      {member.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Mail className="w-3 h-3 text-[#AFC8B8]" />
                      <span className="text-xs text-[#8A9E96] truncate">{member.email}</span>
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center gap-3">
                  {editingRoleId === member.id ? (
                    <div className="flex items-center gap-2">
                      {(["ADMIN", "MEMBER", "GUEST"] as const).map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleChange(member.id, role)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border",
                            member.role === role
                              ? "bg-[#7C9A8B] text-white border-[#7C9A8B]"
                              : "bg-[#F4F7F5] text-[#5C6B64] border-[#DDE5E1] hover:border-[#AFC8B8]"
                          )}
                        >
                          {ROLE_CONFIG[role].label}
                        </button>
                      ))}
                      <button
                        onClick={() => setEditingRoleId(null)}
                        className="p-1.5 rounded-lg hover:bg-[#F4F7F5] text-[#8A9E96] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Badge
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5 border-none",
                          roleConfig.color
                        )}
                      >
                        <RoleIcon className="w-3 h-3" />
                        {roleConfig.label}
                      </Badge>

                      {member.role !== "OWNER" && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingRoleId(member.id)}
                            className="h-8 px-3 rounded-lg bg-white hover:bg-[#F4F7F5] text-[#8A9E96] hover:text-[#5C6B64] border border-[#DDE5E1] transition-all cursor-pointer text-[10px] font-bold uppercase tracking-wider"
                          >
                            Change Role
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member.id, member.name)}
                            className="h-8 w-8 rounded-lg bg-white hover:bg-red-50 text-[#8A9E96] hover:text-red-500 border border-[#DDE5E1] hover:border-red-100 transition-all cursor-pointer flex items-center justify-center"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-5 bg-[#F4F7F5]/50 rounded-3xl border border-dashed border-[#AFC8B8]">
            <div className="p-6 rounded-full bg-white shadow-sm border border-[#DDE5E1]">
              <Users className="w-8 h-8 text-[#AFC8B8]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[#2F3A35]">
                {searchQuery ? "No matches found" : "No team members yet"}
              </h3>
              <p className="text-[#8A9E96] text-sm font-light max-w-xs mx-auto">
                {searchQuery
                  ? "Try a different search term."
                  : "Add your first team member to get started."}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="text-xs font-bold text-[#7C9A8B] uppercase tracking-widest hover:text-[#5F7D6E] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add your first person
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMember}
        />
      )}
    </div>
  );
}

/* ── Add Member Modal ── */
function AddMemberModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: { email: string; name: string; role: string }) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({ email: email.trim(), name: name.trim(), role });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#2F3A35]/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#DDE5E1] overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#2F3A35]">Add Person</h2>
            <p className="text-[#8A9E96] text-sm font-light">
              Invite someone to join your workspace.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#F4F7F5] text-[#AFC8B8] hover:text-[#7C9A8B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
              <Mail className="w-3 h-3 text-[#7C9A8B]" />
              Email Address
            </label>
            <input
              autoFocus
              required
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-3.5 text-[#2F3A35] font-medium outline-hidden transition-all text-base placeholder:text-[#AFC8B8]"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
              <UserCircle className="w-3 h-3 text-[#7C9A8B]" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F4F7F5] border border-[#DDE5E1] focus:border-[#7C9A8B] focus:ring-4 focus:ring-[#7C9A8B]/5 rounded-xl px-5 py-3.5 text-[#2F3A35] font-medium outline-hidden transition-all text-base placeholder:text-[#AFC8B8]"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8A9E96] ml-1 flex items-center gap-2">
              <Shield className="w-3 h-3 text-[#7C9A8B]" />
              Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["ADMIN", "MEMBER", "GUEST"] as const).map((r) => {
                const config = ROLE_CONFIG[r];
                const Icon = config.icon;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer",
                      role === r
                        ? "border-[#7C9A8B] bg-[#7C9A8B]/5"
                        : "border-[#DDE5E1] bg-white hover:border-[#AFC8B8]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center",
                        role === r ? config.color : "bg-[#E9EFEC] text-[#8A9E96]"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        role === r ? "text-[#2F3A35]" : "text-[#8A9E96]"
                      )}
                    >
                      {config.label}
                    </span>
                    <span className="text-[9px] text-[#8A9E96] text-center leading-tight">
                      {config.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#F4F7F5] text-[#8A9E96] hover:text-[#5C6B64] py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting || !email.trim()}
              type="submit"
              className="flex-2 bg-[#7C9A8B] text-white hover:bg-[#5F7D6E] py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Team
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
