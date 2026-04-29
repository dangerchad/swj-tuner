import { totalSecsOnDate } from '../../state/practiceStore';
import type { PracticeLog } from '../../state/practiceStore';

interface Props {
  logs: PracticeLog[];
}

const CELL = 14;
const GAP  = 2;
const COLS  = 15; // weeks
const ROWS  = 7;  // days

function cellColor(seconds: number): string {
  const m = seconds / 60;
  if (m === 0)   return 'var(--color-surface-3)';
  if (m < 10)    return 'rgba(74,222,128,0.25)';
  if (m < 20)    return 'rgba(74,222,128,0.45)';
  if (m < 30)    return 'rgba(74,222,128,0.65)';
  if (m < 60)    return 'rgba(74,222,128,0.85)';
  return 'var(--color-accent)';
}

function buildGrid() {
  const today = new Date();
  const todayDow = today.getDay(); // 0=Sun

  // Align grid start to the Sunday COLS weeks ago
  const start = new Date(today);
  start.setDate(today.getDate() - todayDow - (COLS - 1) * 7);

  const cells: { date: string; col: number; row: number; isFuture: boolean; isToday: boolean }[] = [];
  const todayStr = today.toISOString().slice(0, 10);

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const d = new Date(start);
      d.setDate(start.getDate() + col * 7 + row);
      const dateStr = d.toISOString().slice(0, 10);
      cells.push({
        date: dateStr,
        col,
        row,
        isFuture: dateStr > todayStr,
        isToday: dateStr === todayStr,
      });
    }
  }

  // Month labels: first date in each column
  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = '';
  for (let col = 0; col < COLS; col++) {
    const d = new Date(start);
    d.setDate(start.getDate() + col * 7);
    const mo = d.toLocaleString('en-US', { month: 'short' });
    if (mo !== lastMonth) {
      monthLabels.push({ col, label: mo });
      lastMonth = mo;
    }
  }

  return { cells, monthLabels };
}

const DOW_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const LABEL_W = 12;

export default function PracticeCalendar({ logs }: Props) {
  const { cells, monthLabels } = buildGrid();
  const SVG_W = LABEL_W + COLS * (CELL + GAP) - GAP;
  const SVG_H = 16 + ROWS * (CELL + GAP) - GAP;

  return (
    <div>
      <p className="text-xs mb-2" style={{ color: 'var(--color-text-3)' }}>
        Last {COLS} weeks
      </p>
      <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <svg width={SVG_W} height={SVG_H} style={{ display: 'block' }}>
          {/* Month labels */}
          {monthLabels.map(({ col, label }) => (
            <text
              key={`mo-${col}`}
              x={LABEL_W + col * (CELL + GAP)}
              y={10}
              fontSize={8}
              fontFamily="'DM Sans', sans-serif"
              fill="var(--color-text-3)"
            >
              {label}
            </text>
          ))}

          {/* Day-of-week labels */}
          {[1, 3, 5].map((row) => (
            <text
              key={`dow-${row}`}
              x={0}
              y={16 + row * (CELL + GAP) + CELL / 2 + 3}
              fontSize={7}
              fontFamily="'DM Sans', sans-serif"
              fill="var(--color-text-3)"
            >
              {DOW_LABELS[row]}
            </text>
          ))}

          {/* Cells */}
          {cells.map(({ date, col, row, isFuture, isToday }) => {
            const secs = totalSecsOnDate(logs, date);
            const fill = isFuture ? 'transparent' : cellColor(secs);
            const x = LABEL_W + col * (CELL + GAP);
            const y = 16 + row * (CELL + GAP);
            return (
              <rect
                key={date}
                x={x} y={y}
                width={CELL} height={CELL}
                rx={3}
                fill={fill}
                stroke={isToday ? 'var(--color-accent)' : 'none'}
                strokeWidth={isToday ? 1.5 : 0}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>Less</span>
        {['var(--color-surface-3)', 'rgba(74,222,128,0.25)', 'rgba(74,222,128,0.5)', 'rgba(74,222,128,0.75)', 'var(--color-accent)'].map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
        ))}
        <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>More</span>
      </div>
    </div>
  );
}
