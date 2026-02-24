import { TeamManagement } from "@/components/dashboard/TeamManagement";

export const metadata = {
  title: "Team | FlowBoard",
  description: "Manage your team members and assign roles.",
};

export default function TeamPage() {
  return (
    <div className="space-y-12 pb-20 fade-in-up">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border border-[#DDE5E1] p-8 lg:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
        <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-[#AFC8B8]/12 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#7C9A8B]/10 border border-[#7C9A8B]/20 text-[#5F7D6E] text-[11px] font-semibold uppercase tracking-[0.08em]">
                People
              </span>
              <div className="h-3.5 w-px bg-[#DDE5E1]" />
              <span className="text-[11px] text-[#8A9E96] font-medium uppercase tracking-[0.12em]">
                Team Management
              </span>
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-[#2F3A35]">
                Your Team
              </h1>
              <p className="mt-2 text-base text-[#5C6B64] font-light leading-relaxed max-w-md">
                Add people, assign roles, and keep everyone aligned on what matters.
              </p>
            </div>
          </div>
        </div>
      </div>

      <TeamManagement />
    </div>
  );
}
