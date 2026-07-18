import { create } from 'zustand';
import type { IncidentItem } from '@/lib/types';

interface IncidentStore {
  incidents: IncidentItem[];
  setIncidents: (incidents: IncidentItem[]) => void;
}

export const useIncidentStore = create<IncidentStore>((set) => ({
  incidents: [],
  setIncidents: (incidents) => set({ incidents }),
}));
