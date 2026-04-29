import { useState } from 'react';
import { usePracticeStore, todayStr } from '../../state/practiceStore';

export default function QuickLog() {
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(15);
  const [notes, setNotes] = useState('');
  const { addLog } = usePracticeStore();

  function submit() {
    if (minutes <= 0) return;
    addLog({
      id: Date.now().toString(),
      date: todayStr(),
      startedAt: Date.now() - minutes * 60 * 1000,
      duration: minutes * 60,
      notes,
      songs: [],
      links: [],
    });
    setOpen(false);
    setMinutes(15);
    setNotes('');
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-start text-xs px-3 py-1.5 rounded-lg border"
        style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-text-2)' }}
      >
        + Log practice manually
      </button>
    );
  }

  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ borderColor: 'var(--color-border-strong)', background: 'var(--color-surface-1)' }}
    >
      <p className="text-sm font-medium" style={{ color: 'var(--color-text-1)' }}>Log practice</p>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--color-text-3)' }}>Duration (minutes)</label>
        <div className="flex items-center gap-3">
          <input
            type="range" min={1} max={120} step={1} value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="flex-1 accent-[#4ADE80]"
          />
          <span className="font-mono text-sm w-10 text-right" style={{ color: 'var(--color-text-1)' }}>
            {minutes}m
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: 'var(--color-text-3)' }}>Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you work on?"
          rows={2}
          className="w-full text-sm rounded-lg p-2.5 resize-none outline-none border"
          style={{
            background: 'var(--color-surface-2)',
            borderColor: 'var(--color-border-strong)',
            color: 'var(--color-text-1)',
          }}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={submit}
          className="text-xs font-medium px-4 py-1.5 rounded-lg"
          style={{ background: 'var(--color-accent)', color: '#0A0A0C' }}
        >
          Save
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-xs px-3 py-1.5 rounded-lg border"
          style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-text-3)' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
