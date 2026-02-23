'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  visualPanel?: React.ReactNode;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  title,
  description,
  visualPanel,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-cream grain-overlay flex flex-col">
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-surface-sunken z-[60]">
        <motion.div
          className="h-full bg-soft-blue"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row h-full">
        {/* Left Side: Form Content */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col p-8 sm:p-12 lg:p-16 xl:p-24 justify-center">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-md mx-auto w-full"
          >
            <div className="mb-10 lg:mb-16">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-soft-blue font-bold mb-4 block">
                Step 0{currentStep} / 0{totalSteps}
              </span>
              <h2 className="font-syne text-[32px] sm:text-[42px] leading-[1.1] text-sage-deep font-bold mb-6">
                {title}
              </h2>
              <p className="font-mono text-[13px] text-sage-deep/60 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-8">
              {children}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Visual Panel */}
        <div className="hidden lg:block lg:flex-1 bg-surface-tinted relative overflow-hidden m-4 rounded-[32px] border border-border-soft overflow-hidden">
          <div className="absolute inset-0 editorial-grid opacity-10" />
          <div className="absolute inset-0 bg-gradient-hero-glow opacity-50" />
          
          <div className="relative h-full w-full flex items-center justify-center p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="w-full h-full flex items-center justify-center"
              >
                {visualPanel || (
                  <div className="w-full aspect-video bg-surface-elevated rounded-[24px] shadow-elevated border border-border-soft flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 pastel-dots opacity-[0.05]" />
                     <div className="text-sage-deep/10 font-syne text-[120px] font-bold select-none">
                        F{currentStep}
                     </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Sidebar-like Minimal Footer */}
      <div className="fixed bottom-8 left-8 lg:left-12 flex items-center gap-4 text-[10px] font-mono tracking-widest text-sage-deep/30 uppercase pointer-events-none">
        <span className="w-8 h-[1px] bg-sage-deep/20" />
        Curated Setup
      </div>
    </div>
  );
};
