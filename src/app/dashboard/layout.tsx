import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { SidebarProvider } from "@/hooks/use-sidebar";
import FlowBoardChatbot from "@/components/chat/FlowBoardChatbot";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-cream">
        {/* Sidebar */}
        <Sidebar />

        {/* Main area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardNavbar />

          {/* Content area */}
          <main className="flex-1 overflow-y-auto bg-surface-primary/30 p-10 lg:p-16">
            <div className="mx-auto max-w-[1280px]">
              {children}
            </div>
            <FlowBoardChatbot />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
