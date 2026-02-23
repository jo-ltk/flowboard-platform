'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface Step1Props {
  data: {
    workspaceName: string;
    teamSize: string;
    industry: string;
  };
  updateData: (data: Partial<Step1Props['data']>) => void;
  onNext: () => void;
}

export const OnboardingStep1: React.FC<Step1Props> = ({ data, updateData, onNext }) => {
  const industries = ['Design & Creative', 'Technology', 'Marketing', 'Architecture', 'Other'];
  const teamSizes = ['Just me', '2-10 people', '11-50 people', '50+ people'];

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-sage-deep/40 px-1">
            Workspace Name
          </label>
          <input
            type="text"
            value={data.workspaceName}
            onChange={(e) => updateData({ workspaceName: e.target.value })}
            placeholder="e.g. Studio Editorial"
            className="w-full bg-surface-elevated border border-border-soft px-5 py-4 rounded-xl font-syne text-sage-deep placeholder:text-sage-deep/20 focus:outline-none focus:border-soft-blue focus:ring-4 focus:ring-soft-blue/5 transition-all text-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-sage-deep/40 px-1">
            Industry
          </label>
          <div className="grid grid-cols-2 gap-3">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => updateData({ industry: ind })}
                className={`text-left px-4 py-3 rounded-xl border font-mono text-[11px] transition-all ${
                  data.industry === ind
                    ? 'border-soft-blue bg-soft-blue/5 text-sage-deep shadow-glow-blue'
                    : 'border-border-soft bg-surface-elevated text-sage-deep/60 hover:border-soft-blue/30'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-sage-deep/40 px-1">
            Team Size
          </label>
          <div className="flex flex-wrap gap-2">
            {teamSizes.map((size) => (
              <button
                key={size}
                onClick={() => updateData({ teamSize: size })}
                className={`px-4 py-2 rounded-full border font-mono text-[11px] transition-all ${
                  data.teamSize === size
                    ? 'border-light-green bg-light-green/10 text-sage-deep shadow-glow-green'
                    : 'border-border-soft bg-surface-elevated text-sage-deep/60 hover:border-light-green/30'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={onNext}
          disabled={!data.workspaceName || !data.industry || !data.teamSize}
          className="w-full h-14 rounded-xl text-lg tracking-widest group"
        >
          Define Identity
          <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>
      </div>
    </div>
  );
};
