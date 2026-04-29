import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PracticeLog {
  id: string;
  date: string;      // "YYYY-MM-DD"
  startedAt: number; // epoch ms
  duration: number;  // seconds
  notes: string;
  songs: string[];
  links: string[];
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function logsByDate(logs: PracticeLog[], date: string): PracticeLog[] {
  return logs.filter((l) => l.date === date);
}

export function totalSecsOnDate(logs: PracticeLog[], date: string): number {
  return logsByDate(logs, date).reduce((s, l) => s + l.duration, 0);
}

export function fmtDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export function fmtTime(epochMs: number): string {
  return new Date(epochMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface PracticeState {
  logs: PracticeLog[];
  dailyGoalMinutes: number;
  addLog: (log: PracticeLog) => void;
  updateLog: (id: string, updates: Partial<PracticeLog>) => void;
  deleteLog: (id: string) => void;
  setGoal: (minutes: number) => void;
}

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set) => ({
      logs: [],
      dailyGoalMinutes: 30,
      addLog: (log) => set((s) => ({ logs: [log, ...s.logs] })),
      updateLog: (id, updates) =>
        set((s) => ({ logs: s.logs.map((l) => (l.id === id ? { ...l, ...updates } : l)) })),
      deleteLog: (id) =>
        set((s) => ({ logs: s.logs.filter((l) => l.id !== id) })),
      setGoal: (dailyGoalMinutes) => set({ dailyGoalMinutes }),
    }),
    { name: 'swj-practice' },
  ),
);
