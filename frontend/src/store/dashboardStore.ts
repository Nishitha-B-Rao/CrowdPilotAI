import { create } from 'zustand';
import type { Recommendation, StadiumState, AILogEntry } from '@/lib/types';

interface DashboardStore {
  recommendations: Recommendation[];
  addRecommendation: (rec: Recommendation) => void;
  stadiumState: StadiumState | null;
  setStadiumState: (state: StadiumState | null) => void;
  aiLogs: AILogEntry[];
  setAiLogs: (logs: AILogEntry[]) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  recommendations: [],
  addRecommendation: (newRec) =>
    set((state) => {
      const recId = newRec.id || newRec.observation;
      if (state.recommendations.some((r) => (r.id || r.observation) === recId)) {
        return state;
      }
      return { recommendations: [newRec, ...state.recommendations.slice(0, 19)] };
    }),
  stadiumState: null,
  setStadiumState: (stadiumState) => set({ stadiumState }),
  aiLogs: [],
  setAiLogs: (aiLogs) => set({ aiLogs }),
}));
