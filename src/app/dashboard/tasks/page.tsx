import { TaskManagement } from "@/components/dashboard/TaskManagement";

export const metadata = {
  title: "Tasks | FlowBoard",
  description: "View and manage all your tasks.",
};

export default function TasksPage() {
  return (
    <div className="space-y-12 pb-20 fade-in-up">
      {/* Editorial Header Block */}
      <div className="relative overflow-hidden rounded-[40px] bg-linear-to-br from-deep-blue to-deep-blue/90 p-10 lg:p-14 text-cream shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-soft-blue/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-light-green/20 blur-[120px] rounded-full" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-light-green/90 backdrop-blur-md text-deep-blue px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-light-green/20">
                Operations
              </div>
              <div className="h-px w-8 bg-white/20" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
                Workspace Telemetry
              </span>
            </div>
            
            <div className="space-y-3">
              <h1 className="font-syne text-5xl lg:text-7xl font-bold tracking-tight leading-[0.9] text-transparent bg-clip-text bg-linear-to-r from-cream via-white to-cream/80">
                Tasks
              </h1>
              <p className="text-lg text-cream/70 font-medium leading-relaxed max-w-xl">
                The centralized command center for all your strategic pulses and project milestones.
              </p>
            </div>
          </div>
        </div>
      </div>

      <TaskManagement />
    </div>
  );
}
