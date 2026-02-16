import { useActivity, ActivityEvent } from '@/context/ActivityContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ActivityFeed: React.FC = () => {
  const { events } = useActivity();

  const getTypeIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'edit': return '◈';
      case 'comment': return '💬';
      case 'status': return '✓';
      case 'ai': return '✦';
      default: return '●';
    }
  };

  const getTypeColor = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'edit': return 'text-amber-500';
      case 'comment': return 'text-blue-500';
      case 'status': return 'text-green-500';
      case 'ai': return 'text-purple-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-[#E0E7FF]/50 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[14px] font-bold text-[#1E3A8A] tracking-tight uppercase">Live Activity</h3>
          <p className="text-[11px] text-[#64748B] font-medium font-mono lowercase mt-1">Real-time sync active</p>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse [animation-delay:0.2s]" />
          <div className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center opacity-60">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
               <span className="text-xl opacity-50">💤</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">No recent activity</p>
          </div>
        ) : (
          <>
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-linear-to-b from-blue-100 via-blue-50 to-transparent" />

            <div className="flex flex-col gap-6">
              <AnimatePresence initial={false}>
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative flex gap-4 items-start group hover:bg-[#F8FAFC]/50 p-2 -m-2 rounded-xl transition-colors cursor-default"
                  >
                    {/* Status Dot */}
                    <div className="relative z-10 mt-1.5">
                      <div className={`w-[22px] h-[22px] bg-white border border-[#E0E7FF] rounded-full flex items-center justify-center text-[10px] shadow-sm group-hover:scale-110 transition-transform ${getTypeColor(event.type)}`}>
                        {getTypeIcon(event.type)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[12px] text-[#1E293B] font-medium">
                          <span className="font-bold text-[#1E3A8A]">{event.user.name}</span>
                          <span className="mx-1 text-[#64748B] font-normal">{event.action}</span>
                          <span className="font-semibold text-blue-600 underline decoration-blue-200 underline-offset-2">{event.target}</span>
                        </span>
                        <span className="text-[9px] font-mono text-[#94A3B8] uppercase shrink-0">
                          {event.timestamp}
                        </span>
                      </div>
                      
                      {event.type === 'ai' && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 p-2 bg-purple-50/50 rounded-lg border border-purple-100 flex items-center gap-2"
                        >
                           <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">AI Insight</span>
                           <span className="text-[11px] text-purple-700 italic">Optimized workflow efficiency by 12%</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
};
