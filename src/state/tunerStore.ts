import { create } from 'zustand';
import { SWJ_PRESETS } from '../data/presets';
import type { TuningPreset } from '../data/presets';

const PRESET_KEY = 'swj-preset-id';

interface TunerState {
  preset: TuningPreset;
  activeStringIndex: number;
  isListening: boolean;
  setPreset: (preset: TuningPreset) => void;
  setActiveString: (index: number) => void;
  setListening: (listening: boolean) => void;
}

function getInitialPreset(): TuningPreset {
  try {
    const id = localStorage.getItem(PRESET_KEY);
    if (id) return SWJ_PRESETS.find((p) => p.id === id) ?? SWJ_PRESETS[0];
  } catch { /* localStorage unavailable */ }
  return SWJ_PRESETS[0];
}

export const useTunerStore = create<TunerState>((set) => ({
  preset: getInitialPreset(),
  activeStringIndex: 0,
  isListening: false,
  setPreset: (preset) => {
    try { localStorage.setItem(PRESET_KEY, preset.id); } catch { /* ignore */ }
    set({ preset, activeStringIndex: 0 });
  },
  setActiveString: (index) => set({ activeStringIndex: index }),
  setListening: (isListening) => set({ isListening }),
}));
