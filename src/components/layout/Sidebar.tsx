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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { siteConfig } from "@/lib/constants";
import { WorkspaceSwitcher } from "../system/WorkspaceSwitcher";
import { RoleBadge } from "../system/RoleBadge";
import { getActiveWorkspace } from "@/lib/workspace-engine";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/projects", icon: FolderKanban, label: "Projects" },
  { href: "/dashboard/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const activeWs = getActiveWorkspace();

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col bg-deep-blue transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:flex relative z-50",
        collapsed ? "w-[96px]" : "w-72"
      )}
    >
      {/* Logo area */}
      <div
        className={cn(
          "flex h-20 items-center px-8 shrink-0",
          collapsed ? "justify-center" : "gap-4"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer overflow-hidden">
          <img src="/assets/logo.svg" alt="FlowBoard" className="w-full h-full object-contain scale-110" />
        </div>
        {!collapsed && (
          <span className="text-xl font-syne font-bold text-cream tracking-tighter">
            {siteConfig.name}
          </span>
        )}
      </div>

      {/* Workspace Switcher */}
      {!collapsed && (
        <div className="px-2 mb-2">
          <WorkspaceSwitcher />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 p-6 overflow-y-auto scrollbar-hide">
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
                "group flex items-center gap-4 rounded-xl px-4 py-4 text-sm font-bold transition-all duration-300",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-light-green text-deep-blue shadow-lg shadow-light-green/20"
                  : "text-soft-blue/60 hover:bg-soft-blue/10 hover:text-cream"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-all duration-300", 
                isActive ? "scale-110" : "group-hover:translate-x-1"
              )} />
              {!collapsed && (
                <span className="tracking-widest uppercase text-[10px]">
                  {item.label}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-deep-blue/40" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle */}
      <div className="p-6 shrink-0">
        {!collapsed && (
          <div className="mb-6 space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[9px] font-bold text-soft-blue/40 uppercase tracking-[.2em]">Efficiency</p>
                <RoleBadge role={activeWs.role} className="scale-75 origin-right" />
              </div>
              <div className="h-1 w-full bg-deep-blue-dark rounded-full overflow-hidden">
                <div className="h-full bg-light-green w-3/4" />
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={toggle}
          className={cn(
            "flex w-full items-center gap-4 rounded-xl px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-soft-blue/40 transition-all duration-300 hover:bg-soft-blue/10 hover:text-cream group",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Collapse View</span>
            </>
          )}
        </button>
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-soft-blue/10 to-transparent" />
    </aside>
  );
}
