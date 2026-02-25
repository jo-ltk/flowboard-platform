import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { SidebarProvider } from "@/hooks/use-sidebar";
import FlowBoardChatbot from "@/components/chat/FlowBoardChatbot";
import { ActivityProvider } from "@/context/ActivityContext";

export const metadata = {
  title: "Dashboard — FlowBoard",
  description: "Your calm command center for focused project management.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ActivityProvider>
        {/* Light sage background for the entire dashboard */}
        <div className="flex h-screen overflow-hidden bg-[#F4F7F5]">

          {/* Sidebar */}
          <Sidebar />

          {/* Main area */}
          <div className="flex flex-1 flex-col overflow-hidden relative">
            <DashboardNavbar />

            {/* Content area — light sage, generous padding */}
            <main className="flex-1 overflow-y-auto bg-[#F4F7F5] p-4 sm:p-6 lg:p-8 xl:p-10 scroll-smooth">
              <div className="mx-auto max-w-[1320px]">
                {children}
              </div>
              <FlowBoardChatbot />
            </main>
          </div>
        </div>
      </ActivityProvider>
    </SidebarProvider>
  );
}

