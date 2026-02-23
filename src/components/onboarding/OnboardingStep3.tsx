'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface Step3Props {
  data: {
    automationLevel: 'balanced' | 'aggressive' | 'minimal';
  };
  updateData: (data: Partial<Step3Props['data']>) => void;
  onNext: () => void;
}

export const OnboardingStep3: React.FC<Step3Props> = ({ data, updateData, onNext }) => {
  const options: { id: 'balanced' | 'aggressive' | 'minimal'; title: string; desc: string; icon: string }[] = [
    {
      id: 'minimal',
      title: 'Manual Precision',
      desc: 'AI provides suggestions only when explicitly requested. You stay in full control.',
      icon: 'M',
    },
    {
      id: 'balanced',
      title: 'Balanced Assist',
      desc: 'Smart categorization and automatic tagging. The perfect blend of speed and control.',
      icon: 'B',
    },
    {
      id: 'aggressive',
      title: 'Autonomous Flow',
      desc: 'Predictive task creation and full workflow automation. Designed for maximum velocity.',
      icon: 'A',
    },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => updateData({ automationLevel: option.id })}
            className={`w-full p-6 bg-surface-elevated border  text-left transition-all ${
              data.automationLevel === option.id
                ? 'border-light-green bg-light-green/5 shadow-glow-green'
                : 'border-border-soft hover:border-light-green/30'
            }`}
          >
            <div className="flex items-start gap-5">
              <div className={`w-12 h-12 rounded-full border border-border-soft flex items-center justify-center font-serif text-xl shrink-0 transition-colors ${
                data.automationLevel === option.id ? 'bg-light-green text-sage-deep' : 'bg-surface-sunken text-sage-deep/20'
              }`}>
                {option.icon}
              </div>
              <div>
                <h3 className="font-syne font-bold text-sage-deep text-lg mb-1">
                  {option.title}
                </h3>
                <p className="font-mono text-[11px] text-sage-deep/50 leading-relaxed">
                  {option.desc}
                </p>
              </div>
              
              <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                data.automationLevel === option.id 
                  ? 'border-light-green bg-light-green' 
                  : 'border-border-soft bg-transparent'
              }`}>
                {data.automationLevel === option.id && (
                  <svg className="w-4 h-4 text-sage-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-4">
        <Button
          variant="accent"
          onClick={onNext}
          className="w-full h-14 rounded-xl text-lg tracking-widest group"
        >
          Configure AI
          <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>
      </div>
    </div>
  );
};
