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
        "hidden h-screen flex-col bg-white border-r border-[#DDE5E1] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:flex relative z-50 shadow-[2px_0_16px_rgba(0,0,0,0.03)]",
        collapsed ? "w-[80px]" : "w-[240px]"
      )}
    >
      {/* Logo area */}
      <Link
        href="/"
        className={cn(
          "flex h-18 items-center px-5 shrink-0 group hover:opacity-80 transition-opacity border-b border-[#DDE5E1]",
          collapsed ? "justify-center py-5" : "gap-3 py-5"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7C9A8B]/10 border border-[#7C9A8B]/20">
          <img src="/assets/logo.svg" alt="FlowBoard" className="w-5 h-5 object-contain" />
        </div>
        {!collapsed && (
          <span className="text-[15px] font-semibold text-[#2F3A35] tracking-tight">
            {siteConfig.name}
          </span>
        )}
      </Link>

      {/* Workspace Switcher */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-[#DDE5E1]">
          <WorkspaceSwitcher />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3 overflow-y-auto scrollbar-hide">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A9E96] px-3 mb-2 mt-1">
            Navigation
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
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-[#7C9A8B]/12 text-[#5F7D6E] border border-[#7C9A8B]/20"
                  : "text-[#8A9E96] hover:bg-[#F4F7F5] hover:text-[#5C6B64]"
              )}
            >
              <item.icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-all duration-200",
                  isActive ? "text-[#7C9A8B]" : "group-hover:text-[#7C9A8B]"
                )}
              />
              {!collapsed && (
                <span className="text-[13px]">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7C9A8B]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#DDE5E1] shrink-0">
        {!collapsed && (
          <div className="mb-3 p-4 rounded-xl bg-[#F4F7F5] border border-[#DDE5E1]">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-3 h-3 text-[#7C9A8B]" />
                <p className="text-[10px] font-semibold text-[#8A9E96] uppercase tracking-[0.1em]">
                  Flow Score
                </p>
              </div>
              <RoleBadge role={activeWs.role} className="scale-75 origin-right" />
            </div>
            <div className="h-1.5 w-full bg-[#DDE5E1] rounded-full overflow-hidden">
              <div className="h-full bg-[#7C9A8B] rounded-full w-3/4 transition-all duration-700" />
            </div>
            <p className="text-[10px] text-[#8A9E96] mt-1.5 font-medium">75% — Great progress</p>
          </div>
        )}

        {/* Landing link */}
        <Link
          href="/"
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] font-medium text-[#8A9E96] transition-all duration-200 hover:bg-[#F4F7F5] hover:text-[#5C6B64] group mb-1",
            collapsed && "justify-center px-2"
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Visit Site</span>}
        </Link>

        {/* Collapse Toggle */}
        <button
          onClick={toggle}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] font-medium text-[#8A9E96] transition-all duration-200 hover:bg-[#F4F7F5] hover:text-[#5C6B64] group",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
