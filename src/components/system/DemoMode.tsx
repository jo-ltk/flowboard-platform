"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, SkipForward, X, Sparkles, Target } from "lucide-react";
import { useDemoMode } from "@/context/DemoContext";
import { getDemoWalkthroughSteps } from "@/lib/ai-simulation";
import { Button } from "@/components/ui/Button";

export function DemoMode() {
  const { isDemoMode, toggleDemoMode, demoStep, nextStep, setDemoStep } = useDemoMode();
  const steps = getDemoWalkthroughSteps();
  const currentStep = steps[demoStep];

  if (!isDemoMode) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Soft Blue Spotlight Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-sage-deep/20 backdrop-blur-[2px]"
          style={{
            maskImage: "radial-gradient(circle at 50% 50%, transparent 20%, black 100%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent 20%, black 100%)",
          }}
        />

        {/* Narrative Caption Card */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 pointer-events-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-cream border border-soft-blue/30 rounded-[24px] p-8 shadow-mega overflow-hidden relative"
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-soft-blue/10">
              <motion.div
                className="h-full bg-soft-blue"
                initial={{ width: 0 }}
                animate={{ width: `${((demoStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-soft-blue/10 flex items-center justify-center text-soft-blue">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-sage-deep">Investor Demo</h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-soft-blue">
                    Step {demoStep + 1} of {steps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleDemoMode}
                className="p-2 hover:bg-surface-sunken rounded-lg transition-colors text-sage-deep/40 hover:text-sage-deep"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={demoStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <h4 className="text-xl font-syne font-bold text-sage-deep">
                  {currentStep.title}
                </h4>
                <p className="text-sage-deep/70 leading-relaxed italic">
                  "{currentStep.content}"
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={() => setDemoStep(Math.max(0, demoStep - 1))}
                disabled={demoStep === 0}
                className="text-xs border-soft-blue/20"
              >
                Previous
              </Button>
              
              <div className="flex gap-3">
                {demoStep < steps.length - 1 ? (
                  <Button
                    onClick={nextStep}
                    className="bg-sage-deep text-white group"
                  >
                    Next Logic
                    <SkipForward className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    onClick={toggleDemoMode}
                    className="bg-light-green text-sage-deep font-bold px-8"
                  >
                    Complete Demo
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Highlight Spotlight (Pure Visual) */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-soft-blue/5 blur-[120px] rounded-full pointer-events-none"
        />
      </div>
    </AnimatePresence>
  );
}
