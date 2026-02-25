import { TeamManagement } from "@/components/dashboard/TeamManagement";

export const metadata = {
  title: "Team | FlowBoard",
  description: "Manage your team members and assign roles.",
};

export default function TeamPage() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-20 fade-in-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border border-border-soft p-6 sm:p-8 lg:p-10 shadow-soft rounded-2xl lg:rounded-3xl">
        <div className="absolute top-0 right-0 w-[200px] sm:w-[300px] h-[150px] sm:h-[200px] bg-sage-soft/10 blur-[60px] sm:blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-sage/10 border border-sage/20 text-sage-mid text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
              People
            </span>
            <div className="h-3.5 w-px bg-border-soft" />
            <span className="text-[10px] sm:text-[11px] text-text-muted font-medium uppercase tracking-widest">
              Team Management
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-sage-deep">
              Your Team
            </h1>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-text-secondary font-light leading-relaxed max-w-md">
              Add people, assign roles, and keep everyone aligned on what matters.
            </p>
          </div>
        </div>
      </div>

      <TeamManagement />
    </div>
  );
}
