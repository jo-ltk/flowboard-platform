import { TaskManagement } from "@/components/dashboard/TaskManagement";

export const metadata = {
  title: "Task Pipeline | FlowBoard",
  description: "Manage your tasks through a structured pipeline workflow.",
};

export default function TasksPage() {
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border border-[#DDE5E1] p-8 lg:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.05)] fade-in-up">
        <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-[#AFC8B8]/12 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[150px] bg-[#7C9A8B]/8 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#7C9A8B]/10 border border-[#7C9A8B]/20 text-[#5F7D6E] text-[11px] font-semibold uppercase tracking-[0.08em]">
                Task Pipeline
              </span>
              <div className="h-3.5 w-px bg-[#DDE5E1]" />
              <span className="text-[11px] text-[#8A9E96] font-medium uppercase tracking-[0.12em]">
                Workflow Manager
              </span>
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-[#2F3A35]">
                Task Pipeline
              </h1>
              <p className="mt-2 text-base text-[#5C6B64] font-light leading-relaxed max-w-lg">
                Track every task through a clear, step-by-step workflow — from start to finish.
              </p>
            </div>
          </div>

          {/* Pipeline Steps Preview */}
          <div className="lg:col-span-5">
            <div className="bg-[#F4F7F5] rounded-xl p-5 border border-[#DDE5E1]">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#8A9E96] mb-3">
                Pipeline Flow
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: "Not Started", color: "#8A9E96" },
                  { label: "On Hold", color: "#D97706" },
                  { label: "In Progress", color: "#2563EB" },
                  { label: "Completed", color: "#059669" },
                  { label: "Suspended", color: "#9333EA" },
                  { label: "Cancelled", color: "#DC2626" },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-[#DDE5E1]">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: step.color }}
                      />
                      <span className="text-[8px] font-semibold text-[#5C6B64]">
                        {step.label}
                      </span>
                    </div>
                    {i < 5 && (
                      <svg className="w-3 h-3 text-[#DDE5E1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskManagement />
    </div>
  );
}
