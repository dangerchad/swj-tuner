import { create } from 'zustand';

interface DetectionState {
  frequency: number;
  clarity: number;
  noteName: string;
  noteOctave: number;
  cents: number;
  chord: string;
  chordHistory: string[];
  key: string;
  chroma: number[];
  mode: 'note' | 'chord';
  userLockedMode: boolean;  // true when user manually picked a mode pill

  setDetection: (freq: number, clarity: number, note: string, octave: number, cents: number) => void;
  setChord: (chord: string) => void;
  setKey: (key: string) => void;
  setChroma: (chroma: number[]) => void;
  setMode: (mode: 'note' | 'chord') => void;
  setModeManual: (mode: 'note' | 'chord') => void;  // user-initiated, locks mode
  reset: () => void;
}

export const useDetectionStore = create<DetectionState>((set) => ({
  frequency: 0,
  clarity: 0,
  noteName: '',
  noteOctave: 0,
  cents: 0,
  chord: '',
  chordHistory: [],
  key: '',
  chroma: new Array(12).fill(0),
  mode: 'note',
  userLockedMode: false,

  setDetection: (frequency, clarity, noteName, noteOctave, cents) =>
    set({ frequency, clarity, noteName, noteOctave, cents }),

  setChord: (chord) =>
    set((s) => ({
      chord,
      chordHistory: chord
        ? [chord, ...s.chordHistory.filter((c) => c !== chord)].slice(0, 8)
        : s.chordHistory,
    })),

  setKey: (key) => set({ key }),
  setChroma: (chroma) => set({ chroma }),

  // Auto mode — from AudioEngine, respects userLockedMode
  setMode: (mode) => set((s) => s.userLockedMode ? s : { mode }),

  // Manual mode — user tapped a pill, locks it
  setModeManual: (mode) => set({ mode, userLockedMode: true }),

  reset: () =>
    set({ frequency: 0, clarity: 0, noteName: '', noteOctave: 0, cents: 0, chord: '', key: '' }),
}));
