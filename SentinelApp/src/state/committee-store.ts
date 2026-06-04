import { create } from 'zustand';
import { DebateEvent, CommitteeDecision, StrategyInputs } from '@/committee/types';

interface CommitteeState {
  timeline: DebateEvent[];
  decision: CommitteeDecision | null;
  isRunning: boolean;
  activeAgent: string | null;
  generateStrategy: (inputs: StrategyInputs) => Promise<void>;
}

export const useCommitteeStore = create<CommitteeState>((set) => ({
  timeline: [],
  decision: null,
  isRunning: false,
  activeAgent: null,
  
  generateStrategy: async (inputs: StrategyInputs) => {
    set({ isRunning: true, timeline: [], decision: null, activeAgent: 'Bull Agent' });
    
    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      
      if (!response.ok) throw new Error('Failed to fetch debate');
      
      const data = await response.json();
      
      // For a "live" feel, we could animate this. For now, we simulate streaming by appending slowly.
      const timelineData = data.timeline as DebateEvent[];
      
      for (const event of timelineData) {
        set({ activeAgent: event.agent });
        // Simulate thinking time
        await new Promise(resolve => setTimeout(resolve, 800));
        set((state) => ({ timeline: [...state.timeline, event] }));
      }
      
      set({ 
        decision: data.decision, 
        isRunning: false, 
        activeAgent: null 
      });
      
    } catch (error) {
      console.error(error);
      set({ isRunning: false, activeAgent: null });
    }
  }
}));
