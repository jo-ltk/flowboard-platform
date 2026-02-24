"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  Leaf,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { siteConfig } from "@/lib/constants";
import { WorkspaceSwitcher } from "../system/WorkspaceSwitcher";
import { RoleBadge } from "../system/RoleBadge";
import { useWorkspaces } from "@/context/WorkspaceContext";

const navItems = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Overview"  },
  { href: "/dashboard/projects",  icon: FolderKanban,    label: "Projects"  },
  { href: "/dashboard/tasks",     icon: CheckSquare,     label: "Tasks"     },
  { href: "/dashboard/team",      icon: Users,           label: "Team"      },
  { href: "/dashboard/billing",   icon: CreditCard,      label: "Billing"   },
  { href: "/dashboard/settings",  icon: Settings,        label: "Settings"  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const { activeWorkspace: activeWs } = useWorkspaces();

  console.log("[Sidebar] Render. Active Workspace:", activeWs.name);

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col bg-white border-r border-[#DDE5E1] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:flex relative z-50",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Logo area */}
      <Link
        href="/"
        className={cn(
          "flex h-16 items-center px-6 shrink-0 group transition-all border-b border-[#DDE5E1]",
          collapsed ? "justify-center" : "gap-4"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-[#2F3A35] text-white">
          <img src="/assets/logo.svg" alt="FlowBoard" className="w-5 h-5 object-contain invert" />
        </div>
        {!collapsed && (
          <span className="text-[14px] font-black text-[#2F3A35] uppercase tracking-[0.3em]">
            {siteConfig.name}
          </span>
        )}
      </Link>

      {/* Workspace Switcher */}
      {!collapsed && (
        <div className="px-6 py-8 border-b border-[#DDE5E1] bg-[#f8faf9]">
          <WorkspaceSwitcher />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-1 flex-col p-4 overflow-y-auto scrollbar-hide">
        {!collapsed && (
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8A9E96] px-4 mb-4 mt-2">
            Protocols
          </p>
        )}
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group flex items-center gap-4 rounded-none px-4 py-3.5 text-sm transition-all duration-300",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-[#2F3A35] text-white"
                  : "text-[#8A9E96] hover:bg-[#F4F7F5] hover:text-[#2F3A35]"
              )}
            >
              <item.icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-all",
                  isActive ? "text-[#8CBA41]" : "group-hover:text-[#2F3A35]"
                )}
              />
              {!collapsed && (
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1 h-4 bg-[#8CBA41]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Performance */}
      <div className="p-4 border-t border-[#DDE5E1] bg-[#f8faf9] shrink-0">
        {!collapsed && (
          <div className="mb-4 p-5 rounded-none bg-white border border-[#DDE5E1]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5 text-[#8CBA41]" />
                <p className="text-[10px] font-bold text-[#2F3A35] uppercase tracking-[0.2em]">
                  Performance
                </p>
              </div>
            </div>
            <div className="h-1 w-full bg-[#DDE5E1] rounded-none overflow-hidden">
              <div className="h-full bg-[#8CBA41] w-3/4" />
            </div>
            <p className="text-[9px] text-[#8A9E96] mt-2 font-bold uppercase tracking-widest">Efficiency: 75%</p>
          </div>
        )}

        {/* Action Links */}
        <div className="space-y-1">
          <Link
            href="/"
            className={cn(
              "flex w-full items-center gap-4 rounded-none px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A9E96] transition-all hover:bg-white hover:text-[#2F3A35] border border-transparent hover:border-[#DDE5E1]",
              collapsed && "justify-center"
            )}
          >
            <Home className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Portal Home</span>}
          </Link>

          <button
            onClick={toggle}
            className={cn(
              "flex w-full items-center gap-4 rounded-none px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A9E96] transition-all hover:bg-white hover:text-[#2F3A35] border border-transparent hover:border-[#DDE5E1]",
              collapsed && "justify-center"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Secure Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
