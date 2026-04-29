import { useState } from 'react';
import { usePracticeStore, todayStr, totalSecsOnDate, logsByDate, fmtDuration } from '../state/practiceStore';
import GoalRing from '../components/practice/GoalRing';
import PracticeCalendar from '../components/practice/PracticeCalendar';
import SessionLog from '../components/practice/SessionLog';
import QuickLog from '../components/practice/QuickLog';

function WeekHistory() {
  const { logs } = usePracticeStore();
  const days: { date: string; label: string }[] = [];

  for (let i = 1; i <= 6; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    if (totalSecsOnDate(logs, date) === 0) continue;
    days.push({
      date,
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    });
  }

  if (days.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium" style={{ color: 'var(--color-text-2)' }}>This week</p>
      {days.map(({ date, label }) => {
        const secs = totalSecsOnDate(logs, date);
        const dayLogs = logsByDate(logs, date);
        const notedLogs = dayLogs.filter((l) => l.notes || l.songs.length);
        return (
          <div
            key={date}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-1)' }}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium" style={{ color: 'var(--color-text-2)' }}>{label}</span>
              {notedLogs[0]?.notes && (
                <span className="text-xs truncate max-w-[180px]" style={{ color: 'var(--color-text-3)' }}>
                  {notedLogs[0].notes}
                </span>
              )}
              {notedLogs[0]?.songs.length > 0 && !notedLogs[0].notes && (
                <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>
                  {notedLogs[0].songs.slice(0, 2).join(', ')}
                </span>
              )}
            </div>
            <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-accent)' }}>
              {fmtDuration(secs)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function PracticePage() {
  const { logs, dailyGoalMinutes, setGoal } = usePracticeStore();
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState(dailyGoalMinutes);
  const today = todayStr();
  const todaySecs = totalSecsOnDate(logs, today);

  return (
    <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between pt-2">
        <h2 className="font-mono text-base font-bold" style={{ color: 'var(--color-text-1)' }}>
          Practice
        </h2>
        <button
          onClick={() => { setEditingGoal((v) => !v); setGoalDraft(dailyGoalMinutes); }}
          className="text-xs"
          style={{ color: 'var(--color-text-3)' }}
        >
          {editingGoal ? 'Done' : 'Set goal'}
        </button>
      </div>

      {/* Goal editor */}
      {editingGoal && (
        <div className="flex flex-col gap-2">
          <label className="text-xs" style={{ color: 'var(--color-text-3)' }}>
            Daily goal — {goalDraft} min
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range" min={5} max={120} step={5} value={goalDraft}
              onChange={(e) => setGoalDraft(Number(e.target.value))}
              className="flex-1 accent-[#4ADE80]"
            />
            <button
              onClick={() => { setGoal(goalDraft); setEditingGoal(false); }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg"
              style={{ background: 'var(--color-accent)', color: '#0A0A0C' }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Today goal ring */}
      <GoalRing todaySeconds={todaySecs} goalMinutes={dailyGoalMinutes} />

      {/* Today's logged sessions */}
      <SessionLog date={today} logs={logs} />

      {/* Manual log */}
      <QuickLog />

      {/* Heatmap */}
      <PracticeCalendar logs={logs} />

      {/* Week history */}
      <WeekHistory />

      {todaySecs === 0 && logs.length === 0 && (
        <p className="text-sm text-center" style={{ color: 'var(--color-text-3)' }}>
          Practice time auto-saves when you use the tuner for 30+ seconds.
        </p>
      )}
    </div>
  );
}
