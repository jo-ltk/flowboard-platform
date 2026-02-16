"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ActivityEvent {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: 'edit' | 'comment' | 'status' | 'ai';
}

interface ActivityContextType {
  events: ActivityEvent[];
  addEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<ActivityEvent[]>([
    {
      id: '1',
      user: { name: 'Sarah Chen' },
      action: 'completed task',
      target: 'Homepage Redesign',
      timestamp: '2m ago',
      type: 'status'
    },
    {
      id: '2',
      user: { name: 'AI Assistant' },
      action: 'suggested optimization',
      target: 'SEO Meta Tags',
      timestamp: '15m ago',
      type: 'ai'
    },
    {
      id: '3',
      user: { name: 'Marcus Miller' },
      action: 'commented on',
      target: 'User Auth Flow',
      timestamp: '1h ago',
      type: 'comment'
    }
  ]);

  const addEvent = (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    const newEvent: ActivityEvent = {
        ...event,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: 'Just now'
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  return (
    <ActivityContext.Provider value={{ events, addEvent }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}
