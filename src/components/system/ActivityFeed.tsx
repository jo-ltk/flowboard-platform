import { useActivity, ActivityEvent } from '@/context/ActivityContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, MessageSquare, CheckCircle2, Sparkles, Circle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ActivityFeed: React.FC = () => {
  const { events } = useActivity();

  const getTypeIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'edit': return <Edit2 className="w-3 h-3" />;
      case 'comment': return <MessageSquare className="w-3 h-3" />;
      case 'status': return <CheckCircle2 className="w-3 h-3" />;
      case 'ai': return <Sparkles className="w-3 h-3" />;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'edit': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'comment': return 'text-sage bg-sage-pale border-sage-soft/30';
      case 'status': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'ai': return 'text-purple-600 bg-purple-50 border-purple-100';
      default: return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-[#DDE5E1] rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Activity className="w-4 h-4 text-[#7C9A8B]" />
             <h3 className="text-[13px] font-bold text-[#2F3A35] tracking-widest uppercase">Live Activity</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sage"></span>
            </span>
            <p className="text-[10px] text-[#8A9E96] font-bold tracking-tight uppercase">Real-time sync active</p>
          </div>
        </div>
        <div className="flex gap-1.5 opacity-40">
           <div className="w-1 h-3 bg-sage/30 rounded-full" />
           <div className="w-1 h-5 bg-sage/50 rounded-full" />
           <div className="w-1 h-4 bg-sage/40 rounded-full" />
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F4F7F5] flex items-center justify-center mb-4 border border-[#DDE5E1]/50">
               <Activity className="w-6 h-6 text-[#AFC8B8]" />
            </div>
            <p className="text-[11px] text-[#8A9E96] font-bold uppercase tracking-wider">Quiet in the workspace</p>
            <p className="text-[10px] text-[#AFC8B8] mt-1">Activities will appear here in real-time</p>
          </div>
        ) : (
          <>
            {/* Timeline Line */}
            <div className="absolute left-[13px] top-2 bottom-6 w-px bg-linear-to-b from-sage/20 via-sage/5 to-transparent" />

            <div className="flex flex-col gap-7">
              <AnimatePresence initial={false}>
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative flex gap-4 items-start group p-2 -m-2 rounded-xl transition-all duration-300"
                  >
                    {/* Status Dot */}
                    <div className="relative z-10 mt-1">
                      <div className={cn(
                        "w-[28px] h-[28px] rounded-full flex items-center justify-center border shadow-sm group-hover:scale-110 transition-transform duration-300 bg-white",
                        getTypeColor(event.type)
                      )}>
                        {getTypeIcon(event.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-[12px] leading-relaxed text-[#5C6B64]">
                          <span className="font-bold text-[#2F3A35]">{event.user.name}</span>
                          <span className="mx-1.5 opacity-70">{event.action}</span>
                          <span className="font-semibold text-[#7C9A8B] cursor-pointer hover:underline underline-offset-4 decoration-sage/30">{event.target}</span>
                        </div>
                        <span className="text-[9px] font-bold text-[#AFC8B8] uppercase shrink-0 mt-0.5 tracking-tighter">
                          {event.timestamp}
                        </span>
                      </div>
                      
                      {event.type === 'ai' && (
                        <motion.div 
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="mt-2.5 p-2.5 bg-purple-50/40 rounded-xl border border-purple-100/50 flex items-center gap-2.5"
                        >
                           <div className="flex shrink-0 w-5 h-5 rounded-full bg-purple-100 items-center justify-center">
                              <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                           </div>
                           <span className="text-[11px] text-purple-900/70 font-medium italic leading-tight pt-0.5">
                             AI predicts task completion overhead reduced by 15%
                           </span>
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
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #DDE5E1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7C9A8B;
        }
      `}</style>
    </div>
  );
};
