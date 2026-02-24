'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { realtimeSimulator, UserPresence } from '@/lib/realtime-simulator';

export const PresenceSystem: React.FC = () => {
  const [presence, setPresence] = useState<UserPresence[]>([]);
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = realtimeSimulator.subscribe((newPresence) => {
      setPresence(newPresence);
    });
    return () => { unsubscribe(); };
  }, []);

  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-2 mr-4">
        <AnimatePresence>
          {presence.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
              onMouseEnter={() => setHoveredUser(user.id)}
              onMouseLeave={() => setHoveredUser(null)}
              style={{ zIndex: presence.length - index }}
            >
              <div 
                className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold tracking-tighter text-white shadow-sm cursor-pointer transition-transform group-hover:-translate-y-1`}
                style={{ backgroundColor: user.color }}
              >
                {user.avatar}
              </div>
              
              {/* Active Indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#F4F7F5] border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#7C9A8B] rounded-full animate-pulse" />
              </div>

              {/* Typing Indicator */}
              {user.isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-1 -right-1"
                >
                  <span className="flex gap-0.5 bg-white px-1 py-0.5 rounded-full shadow-sm border border-[#DDE5E1]">
                    <span className="w-1 h-1 bg-[#7C9A8B] rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-[#7C9A8B] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-[#7C9A8B] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                </motion.div>
              )}

              {/* User Card Popover */}
              <AnimatePresence>
                {hoveredUser === user.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute top-12 right-0 w-48 bg-white border border-[#DDE5E1] rounded-lg shadow-xl p-4 z-50 pointer-events-none"
                  >
                    <div className="flex items-center gap-3 mb-2">
                       <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#2F3A35] leading-none">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-[#8A9E96] mt-1 flex items-center gap-1 font-bold uppercase tracking-tight">
                          <span className="w-1.5 h-1.5 bg-[#7C9A8B] rounded-full" />
                          Active now
                        </div>
                      </div>
                    </div>
                    
                    {user.isTyping && (
                      <div className="text-[10px] italic text-[#7C9A8B] font-medium">
                        Typing in Task Descriptions...
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-[#F4F7F5]">
                      <div className="text-[10px] uppercase tracking-wider text-[#8A9E96] font-bold">
                        Current Workspace
                      </div>
                      <div className="text-[11px] text-[#5C6B64] mt-1 font-medium">
                        FlowBoard Headquarters
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Extra Users Indicator */}
        <div className="w-9 h-9 rounded-full bg-[#F4F7F5] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#7C9A8B] shadow-sm">
          +2
        </div>
      </div>
    </div>
  );
};
