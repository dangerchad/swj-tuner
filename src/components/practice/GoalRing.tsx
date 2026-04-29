interface Props {
  todaySeconds: number;
  goalMinutes: number;
}

export default function GoalRing({ todaySeconds, goalMinutes }: Props) {
  const goalSeconds = goalMinutes * 60;
  const progress = Math.min(1, goalSeconds > 0 ? todaySeconds / goalSeconds : 0);
  const todayMinutes = Math.floor(todaySeconds / 60);
  const todaySecs = todaySeconds % 60;

  const r = 38;
  const cx = 52;
  const cy = 52;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;

  const done = progress >= 1;
  const strokeColor = done ? 'var(--color-accent)' : 'var(--color-accent)';

  return (
    <div className="flex items-center gap-5">
      <svg width={104} height={104}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={7} />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={strokeColor}
          strokeWidth={7}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dasharray 0.6s ease', opacity: progress > 0 ? 1 : 0 }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={22} fontWeight="700"
          fontFamily="'JetBrains Mono', monospace" fill="var(--color-text-1)">
          {todayMinutes}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={10}
          fontFamily="'JetBrains Mono', monospace" fill="var(--color-text-3)">
          {todaySecs > 0 && todayMinutes < 10 ? `:${String(todaySecs).padStart(2,'0')}` : 'min'}
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fontSize={9}
          fontFamily="'DM Sans', sans-serif" fill="var(--color-text-3)">
          / {goalMinutes} goal
        </text>
      </svg>

      <div className="flex flex-col gap-1">
        {done ? (
          <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-accent)' }}>
            Goal hit!
          </span>
        ) : (
          <span className="text-sm" style={{ color: 'var(--color-text-2)' }}>
            {goalMinutes - todayMinutes} min to go
          </span>
        )}
        <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>
          {Math.round(progress * 100)}% of daily goal
        </span>
      </div>
    </div>
  );
}
