import { TaskManagement } from "@/components/dashboard/TaskManagement";

export const metadata = {
  title: "Task Pipeline | FlowBoard",
  description: "Manage your tasks through a structured pipeline workflow.",
};

export default function TasksPage() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border border-border-soft p-6 sm:p-8 lg:p-10 shadow-soft fade-in-up rounded-2xl lg:rounded-3xl">
        <div className="absolute top-0 right-0 w-[200px] sm:w-[300px] h-[150px] sm:h-[200px] bg-sage-soft/10 blur-[60px] sm:blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[150px] sm:w-[200px] h-[100px] sm:h-[150px] bg-sage/5 blur-[50px] sm:blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-sage/10 border border-sage/20 text-sage-mid text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
                Task Pipeline
              </span>
              <div className="h-3.5 w-px bg-border-soft" />
              <span className="text-[10px] sm:text-[11px] text-text-muted font-medium uppercase tracking-widest">
                Workflow Manager
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-sage-deep">
                Task Pipeline
              </h1>
              <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-text-secondary font-light leading-relaxed max-w-lg">
                Track every task through a clear, step-by-step workflow — from start to finish.
              </p>
            </div>
          </div>

          {/* Pipeline Steps Preview — hidden on small mobile, shown from sm up */}
          <div className="hidden sm:block lg:w-80 xl:w-96 shrink-0">
            <div className="bg-bg-alt rounded-xl p-4 sm:p-5 border border-border-soft">
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-3">
                Pipeline Flow
              </p>
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                {[
                  { label: "Not Started", color: "#8A9E96" },
                  { label: "On Hold", color: "#D97706" },
                  { label: "In Progress", color: "#2563EB" },
                  { label: "Completed", color: "#059669" },
                  { label: "Suspended", color: "#9333EA" },
                  { label: "Cancelled", color: "#DC2626" },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md bg-white border border-border-soft">
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: step.color }}
                      />
                      <span className="text-[7px] sm:text-[8px] font-semibold text-text-secondary whitespace-nowrap">
                        {step.label}
                      </span>
                    </div>
                    {i < 5 && (
                      <svg className="w-2.5 h-2.5 text-border-soft shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
