'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface CompleteProps {
  onComplete: () => void;
  workspaceName: string;
}

export const OnboardingComplete: React.FC<CompleteProps> = ({ onComplete, workspaceName }) => {
  return (
    <div className="flex flex-col items-center text-center space-y-10">
      <div className="relative mb-6">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
           className="w-32 h-32 bg-light-green/20 rounded-full flex items-center justify-center relative z-10"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          >
            <svg className="w-16 h-16 text-sage-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <motion.path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
              />
            </svg>
          </motion.div>
        </motion.div>
        
        {/* Decorative pulses */}
        <div className="absolute inset-0 bg-light-green/10 rounded-full animate-ping opacity-20 scale-150" />
      </div>

      <div className="space-y-4">
        <h2 className="font-syne text-[32px] sm:text-[42px] leading-[1.1] text-sage-deep font-bold">
          System Ready.
        </h2>
        <p className="font-mono text-[13px] text-sage-deep/60 leading-relaxed max-w-xs mx-auto">
          Welcome to <span className="text-sage-deep font-bold">{workspaceName}</span>. Your architectural workspace has been initialized and is ready for execution.
        </p>
      </div>

      <div className="w-full pt-8">
        <Button
          variant="primary"
          onClick={onComplete}
          className="w-full h-14 rounded-xl text-lg tracking-widest group bg-sage-deep"
        >
          Enter Dashboard
          <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>
      </div>
      
      <div className="font-mono text-[10px] tracking-widest text-sage-deep/30 uppercase pt-8">
        Session Certified — FlowBoard
      </div>
    </div>
  );
};
