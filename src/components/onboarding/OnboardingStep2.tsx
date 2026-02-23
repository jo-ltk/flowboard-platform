'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface Step2Props {
  data: {
    workflowStyle: string;
  };
  updateData: (data: Partial<Step2Props['data']>) => void;
  onNext: () => void;
}

export const OnboardingStep2: React.FC<Step2Props> = ({ data, updateData, onNext }) => {
  const styles = [
    {
      id: 'minimal',
      name: 'The Minimalist',
      desc: 'Focus on typography and white space. Ideal for deep work and writing.',
      preview: 'bg-cream-cool',
    },
    {
      id: 'dynamic',
      name: 'The Dynamic',
      desc: 'Data-rich and interactive. Perfect for high-velocity teams and projects.',
      preview: 'bg-surface-tinted',
    },
    {
      id: 'architect',
      name: 'The Architect',
      desc: 'Structural and grid-focused. Designed for technical planning and detail.',
      preview: 'bg-surface-accent',
    },
  ];

  return (
    <div className="space-y-10">
      <div className="grid gap-6">
        {styles.map((style) => (
          <motion.button
            key={style.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateData({ workflowStyle: style.id })}
            className={`flex items-start gap-6 p-6  border text-left transition-all relative overflow-hidden group ${
              data.workflowStyle === style.id
                ? 'border-soft-blue bg-soft-blue/5 shadow-medium'
                : 'border-border-soft bg-surface-elevated hover:border-soft-blue/40'
            }`}
          >
            <div className={`w-24 h-24 rounded-lg shrink-0 overflow-hidden relative border border-border-soft ${style.preview}`}>
               <div className="absolute inset-0 editorial-grid opacity-10" />
               <div className="w-full h-full flex items-center justify-center font-serif text- sage-deep/20 text-4xl">
                 {style.id[0].toUpperCase()}
               </div>
            </div>
            
            <div className="flex-1 pt-1">
              <h3 className="font-syne font-bold text-sage-deep text-xl mb-2 flex items-center justify-between">
                {style.name}
                {data.workflowStyle === style.id && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-soft-blue rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.span>
                )}
              </h3>
              <p className="font-mono text-[12px] text-sage-deep/50 leading-relaxed">
                {style.desc}
              </p>
            </div>
            
            {data.workflowStyle === style.id && (
               <div className="absolute top-0 right-0 w-32 h-32 bg-soft-blue/5 rounded-full blur-3xl -mr-16 -mt-16" />
            )}
          </motion.button>
        ))}
      </div>

      <div className="pt-4 flex gap-4">
        <Button
          onClick={onNext}
          disabled={!data.workflowStyle}
          className="w-full h-14 rounded-xl text-lg tracking-widest group"
        >
          Select Aesthetic
          <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>
      </div>
    </div>
  );
};
