import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  a4: number;
  clarityThreshold: number;
  setA4: (a4: number) => void;
  setClarityThreshold: (t: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      a4: 440,
      clarityThreshold: 0.85,
      setA4: (a4) => set({ a4 }),
      setClarityThreshold: (clarityThreshold) => set({ clarityThreshold }),
    }),
    { name: 'swj-settings' },
  ),
);
