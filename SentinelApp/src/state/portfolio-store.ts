import { create } from 'zustand';
import { PortfolioAllocation } from '@/committee/types';

interface PortfolioState {
  allocation: PortfolioAllocation | null;
  setAllocation: (allocation: PortfolioAllocation) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  allocation: null,
  setAllocation: (allocation) => set({ allocation }),
}));
